import { ResponseHandler, StreamResponse } from '../types'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ClickData } from '../click-data'
import { ResponseAdapter } from '@/utils/request-adapter'
import { ClickContext } from '@/click/shared/click-context.service'

const cookieAge = 30 * 24 * 60 * 60 * 1000 // 30 days

@Injectable()
export class HttpResponseHandler implements ResponseHandler {
  constructor(private readonly clickContext: ClickContext) {}

  public handle(clickResponse: StreamResponse): void {
    const response = this.clickContext.getResponseAdapter()
    const clickData = this.clickContext.getClickData()

    this.setCookies(response, clickData)

    if ('campaignCode' in clickResponse) {
      throw new Error('Action type to campaign not processed')
    }

    response.status(clickResponse.status || HttpStatus.OK)
    if ('url' in clickResponse) {
      response.redirect(clickResponse.url)
    } else {
      response.send(clickResponse.content)
    }
  }

  private setCookies(response: ResponseAdapter, clickData: ClickData) {
    if (typeof clickData.visitorId === 'undefined') {
      throw new Error('clickData.visitorId undefined')
    }
    response.cookie('visitorId', clickData.visitorId, {
      maxAge: cookieAge,
    })
  }
}
