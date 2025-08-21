import { DownloadIp2LocationDatabaseCommand } from '@/commands/download-ip2-location-database/download-ip2-location-database.command'
import { AppConfig } from '@/config/app-config.service'
import { spyOn } from '../../../test/utils/helpers'
import express from 'express'
import archiver from 'archiver'
import stream from 'stream'

describe('download-ip2-location-database.command.spec.ts', () => {
  it('asd', async () => {
    const stream = await createFakeMmdbZipStream()
    createFileServer(1233, stream)

    const command = new DownloadIp2LocationDatabaseCommand(
      { ip2LocationToken: 'token' } as AppConfig,
      'http://localhost:1233',
    )

    let result = ''

    spyOn(command, 'saveFile').mockImplementation(async (file: any) => {
      const buf = await file.buffer()
      result = buf.toString()
    })

    await command.run()

    expect(result).toBe('File content')
  })
})

function createFileServer(port = 3000, stream: stream.Readable) {
  const app = express()

  app.get('/download', (req, res) => {
    const fileName = 'IP2LOCATION-LITE-DB9.zip'
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName)
    stream.pipe(res)
  })

  app.listen(port).unref()
}

async function createFakeMmdbZipStream() {
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })

  archive.append('File content', { name: 'IP2LOCATION-LITE-DB9.MMDB' })
  archive.append('Other file content', { name: 'README_LITE.TXT' })
  await archive.finalize()

  return archive
}
