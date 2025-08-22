import { DownloadIp2LocationDatabaseCommand } from '@/commands/download-ip2-location-database/download-ip2-location-database.command'
import { AppConfig } from '@/config/app-config.service'
import { spyOn } from '../../../test/utils/helpers'
import express from 'express'
import archiver from 'archiver'
import stream from 'stream'
import { setTimeout } from 'timers/promises'

describe('download-ip2-location-database.command.spec.ts', () => {
  it('Should be correct download', async () => {
    // Arrange
    const stream = await createFakeMmdbZipStream([
      { content: 'File content', name: 'IP2LOCATION-LITE-DB9.MMDB' },
      { content: 'Other file content', name: 'README_LITE.TXT' },
    ])

    const server = createFileServer(1233, stream)

    const command = new DownloadIp2LocationDatabaseCommand(
      { ip2LocationToken: 'token' } as AppConfig,
      'http://localhost:1233/',
    )

    let result = ''

    spyOn(command, 'saveFile').mockImplementation(async (file: any) => {
      const buf = await file.buffer()
      result = buf.toString()
    })

    // Act
    await command.run()
    server.close()
    await setTimeout(10)

    // Asser
    expect(result).toBe('File content')
  })

  it('Should be throw error if token not provided download', () => {
    // Arrange
    const command = new DownloadIp2LocationDatabaseCommand(
      {} as AppConfig,
      'http://localhost:1233/',
    )

    // Act Assert
    return expect(() => command.run()).rejects.toThrow('No ip2LocationToken')
  })

  it('Should be throw error if bad path', async () => {
    // Arrange
    const stream = await createFakeMmdbZipStream([])
    const server = createFileServer(1233, stream)
    const command = new DownloadIp2LocationDatabaseCommand(
      { ip2LocationToken: 'token' } as AppConfig,
      'http://localhost:1233/asd',
    )

    // Act Assert
    await expect(() => command.run()).rejects.toThrow(
      'Download error: Not Found',
    )

    server.close()
    await setTimeout(10)
  })

  it('Should be error if no file in zip', async () => {
    // Arrange
    const stream = await createFakeMmdbZipStream([
      { content: 'Other file content', name: 'README_LITE.TXT' },
    ])

    const server = createFileServer(1233, stream)

    const command = new DownloadIp2LocationDatabaseCommand(
      { ip2LocationToken: 'token' } as AppConfig,
      'http://localhost:1233/',
    )

    // Act Assert
    await expect(() => command.run()).rejects.toThrow(
      'File not found in archive',
    )

    server.close()
    await setTimeout(10)
  })
})

function createFileServer(port = 3000, stream: stream.Readable) {
  const app = express()

  app.get('/', (req, res) => {
    const fileName = 'IP2LOCATION-LITE-DB9.zip'
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)
    stream.pipe(res)
  })

  return app.listen(port).unref()
}

async function createFakeMmdbZipStream(files: File[]) {
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })

  files.forEach((file) => {
    archive.append(file.content, { name: file.name })
  })

  await archive.finalize()

  return archive
}

type File = {
  name: string
  content: string
}
