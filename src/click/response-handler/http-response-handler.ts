import { Response } from 'express'
import { ResponseHandler, StreamResponse } from '../types'
import { HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class HttpResponseHandler implements ResponseHandler {
  public handle(httpResponse: Response, clickResponse: StreamResponse): void {
    httpResponse.status(clickResponse.status || HttpStatus.OK)
    if ('url' in clickResponse) {
      httpResponse.redirect(clickResponse.url)
    } else {
      httpResponse.send(clickResponse.content)
    }
  }
}
