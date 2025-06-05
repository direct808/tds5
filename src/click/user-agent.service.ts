import { UAParser } from 'ua-parser-js'
import { Request } from 'express'
import { ClickData } from './click-data'

export class UserAgentService {
  public setUserAgentInfo({
    clickData,
    request,
  }: {
    clickData: ClickData
    request: Request
  }): void {
    const userAgent = request.headers['user-agent']
    if (!userAgent) {
      return
    }
    const parser = UAParser(userAgent)

    clickData.userAgent = userAgent
    clickData.os = parser.os.name
    clickData.osVersion = parser.os.version
    clickData.browser = parser.browser.name
    clickData.browserVersion = parser.browser.version
    clickData.deviceModel = parser.device.model
    clickData.deviceType = parser.device.type
  }
}
