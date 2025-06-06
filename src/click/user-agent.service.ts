import { UAParser } from 'ua-parser-js'
import { IClick } from './click'

type GetUserAgentInfoResult = Pick<
  Partial<IClick>,
  | 'userAgent'
  | 'os'
  | 'osVersion'
  | 'browser'
  | 'browserVersion'
  | 'deviceModel'
  | 'deviceType'
>

export class UserAgentService {
  public getUserAgentInfo(userAgent?: string): GetUserAgentInfoResult {
    if (!userAgent) {
      return {}
    }
    const parser = UAParser(userAgent)

    return {
      userAgent: userAgent,
      os: parser.os.name,
      osVersion: parser.os.version,
      browser: parser.browser.name,
      browserVersion: parser.browser.version,
      deviceModel: parser.device.model,
      deviceType: parser.device.type,
    }
  }
}
