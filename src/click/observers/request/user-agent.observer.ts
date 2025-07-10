import { Injectable } from '@nestjs/common'
import { UAParser } from 'ua-parser-js'
import { ClickData } from '@/click/click-data'
import { ClickObserver } from '@/click/observers/subject'
import { ClickContextService } from '@/click/click-context.service'

@Injectable()
export class UserAgentObserver implements ClickObserver<void> {
  constructor(private readonly clickContext: ClickContextService) {}

  public async handle() {
    const request = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    const userAgent = request.header('user-agent')
    if (!userAgent) {
      return
    }
    const parser = UAParser(userAgent)

    const data: ClickData = {
      userAgent: userAgent,
      os: parser.os.name,
      osVersion: parser.os.version,
      browser: parser.browser.name,
      browserVersion: parser.browser.version,
      deviceModel: parser.device.model,
      deviceType: parser.device.type,
    }

    Object.assign(clickData, data)
  }
}
