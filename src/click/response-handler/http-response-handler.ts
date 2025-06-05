import { ClickContext, ResponseHandler, StreamResponse } from '../types'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ClickData } from '../click-data'
import { Response } from 'express'

const cookieAge = 30 * 24 * 60 * 60 * 1000 // 30 days

@Injectable()
export class HttpResponseHandler implements ResponseHandler {
  public handle(
    { response, clickData }: ClickContext,
    clickResponse: StreamResponse,
  ): void {
    this.setCookies(response, clickData)
    response.status(clickResponse.status || HttpStatus.OK)
    if ('url' in clickResponse) {
      response.redirect(clickResponse.url)
    } else {
      response.send(clickResponse.content)
    }
  }

  private setCookies(response: Response, clickData: ClickData) {
    if (typeof clickData.visitorId === 'undefined') {
      throw new Error('clickData.visitorId undefined')
    }
    response.cookie('visitorId', clickData.visitorId, {
      maxAge: cookieAge,
    })
  }
}
