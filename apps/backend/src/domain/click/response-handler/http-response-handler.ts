import { ResponseHandler } from '../types'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ClickData } from '../click-data'
import { ResponseAdapter } from '../../../shared/request-adapter'
import { ClickContext } from '../shared/click-context.service'

const cookieAge = 30 * 24 * 60 * 60 * 1000 // 30 days

@Injectable()
export class HttpResponseHandler implements ResponseHandler {
  constructor(private readonly clickContext: ClickContext) {}

  public handle: ResponseHandler['handle'] = (streamResponse) => {
    const response = this.clickContext.getResponseAdapter()
    const clickData = this.clickContext.getClickData()

    this.setCookies(response, clickData)

    if ('campaignCode' in streamResponse) {
      throw new Error('Action type to campaign not processed')
    }

    response.status(streamResponse.status || HttpStatus.OK)
    if ('url' in streamResponse) {
      response.redirect(streamResponse.url)
    } else {
      response.send(streamResponse.content)
    }
  }

  private setCookies(response: ResponseAdapter, clickData: ClickData): void {
    if (typeof clickData.visitorId === 'undefined') {
      throw new Error('clickData.visitorId undefined')
    }
    response.cookie('visitorId', clickData.visitorId, {
      maxAge: cookieAge,
    })
  }
}
