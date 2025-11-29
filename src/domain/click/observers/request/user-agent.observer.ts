import { Injectable } from '@nestjs/common'
import { UAParser } from 'ua-parser-js'
import { ClickData } from '@/domain/click/click-data'
import { ClickObserver } from '@/domain/click/observers/subject'
import { ClickContext } from '@/domain/click/shared/click-context.service'

@Injectable()
export class UserAgentObserver implements ClickObserver {
  constructor(private readonly clickContext: ClickContext) {}

  public handle(): void {
    const request = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    const userAgent = request.header('user-agent')
    if (!userAgent) {
      return
    }
    const parser = UAParser(userAgent)

    const data: Partial<ClickData> = {
      userAgent: userAgent,
      os: parser.os.name || null,
      osVersion: parser.os.version || null,
      browser: parser.browser.name || null,
      browserVersion: parser.browser.version || null,
      deviceModel: parser.device.model || null,
      deviceType: parser.device.type || null,
    }

    Object.assign(clickData, data)
  }
}
