import { Injectable } from '@nestjs/common'
import { UAParser } from 'ua-parser-js'
import { ClickData } from '@/click/click-data'
import { ClickObserver, RequestObserverData } from '@/click/observers/subject'

@Injectable()
export class UserAgentObserver implements ClickObserver<RequestObserverData> {
  public async handle({ request, clickData }: RequestObserverData) {
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
