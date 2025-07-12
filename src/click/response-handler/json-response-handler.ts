import { ResponseHandler, StreamResponse } from '../types.js'
import { Injectable } from '@nestjs/common'
import { ClickContext } from '@/click/shared/click-context.service.js'

/**
 * Handler for debug, without real redirects
 */
@Injectable()
export class JsonResponseHandler implements ResponseHandler {
  constructor(private readonly clickContext: ClickContext) {}

  public handle(clickResponse: StreamResponse): void {
    const response = this.clickContext.getResponseAdapter()
    const clickData = this.clickContext.getClickData()

    response.send({ ...clickResponse, clickData })
  }
}
