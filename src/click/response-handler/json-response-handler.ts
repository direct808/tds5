import { Response } from 'express'
import { ResponseHandler, StreamResponse } from '../types'
import { Injectable } from '@nestjs/common'

/**
 * Handler for debug, without real redirects
 */
@Injectable()
export class JsonResponseHandler implements ResponseHandler {
  public handle(httpResponse: Response, clickResponse: StreamResponse): void {
    httpResponse.send(clickResponse)
  }
}
