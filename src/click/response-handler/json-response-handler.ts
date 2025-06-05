import { ClickContext, ResponseHandler, StreamResponse } from '../types'
import { Injectable } from '@nestjs/common'

/**
 * Handler for debug, without real redirects
 */
@Injectable()
export class JsonResponseHandler implements ResponseHandler {
  public handle(
    { response, clickData }: ClickContext,
    clickResponse: StreamResponse,
  ): void {
    response.send({ ...clickResponse, clickData })
  }
}
