import { Command, CommandRunner } from 'nest-commander'
import { pipeline } from 'stream/promises'
import unzipper, { File } from 'unzipper'
import * as fs from 'node:fs'
import { AppConfig } from '@/config/app-config.service'
import { Inject } from '@nestjs/common'
import { IP2LOCATION_URL } from '@/commands/download-ip2-location-database/tokens'

@Command({
  name: 'download-ip2-location-database',
})
export class DownloadIp2LocationDatabaseCommand extends CommandRunner {
  constructor(
    private readonly config: AppConfig,
    @Inject(IP2LOCATION_URL) private readonly url: string,
  ) {
    super()
  }

  async run(): Promise<void> {
    const zipBuffer = await this.download()
    const file = await this.extractArchive(zipBuffer)

    await this.saveFile(file)
  }

  private async download(): Promise<ArrayBuffer> {
    const token = this.config.ip2LocationToken

    if (!token) {
      throw new Error('No ip2LocationToken')
    }

    const url = this.url + `?token=${token}&file=DB9LITEMMDB`

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Download error: ${res.statusText}`)
    }

    return res.arrayBuffer()
  }

  private async extractArchive(zipData: ArrayBuffer): Promise<File> {
    const directory = await unzipper.Open.buffer(Buffer.from(zipData))

    const file = directory.files.find(
      (item) => item.path === 'IP2LOCATION-LITE-DB9.MMDB',
    )

    if (!file) {
      throw new Error('File not found in archive')
    }

    return file
  }

  private async saveFile(file: File) {
    await pipeline(file.stream(), fs.createWriteStream('./geo-ip.mmdb'))
  }
}
