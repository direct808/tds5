import { Injectable } from '@nestjs/common'
import { UAParser } from 'ua-parser-js'
import { ClickData } from '../../click-data'
import { ClickObserver } from '../subject'
import { ClickContext } from '../../shared/click-context.service'

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
