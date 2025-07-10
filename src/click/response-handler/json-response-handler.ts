import { ResponseHandler, StreamResponse } from '../types'
import { Injectable } from '@nestjs/common'
import { ClickContextService } from '@/click/click-context.service'

/**
 * Handler for debug, without real redirects
 */
@Injectable()
export class JsonResponseHandler implements ResponseHandler {
  constructor(private readonly clickContext: ClickContextService) {}

  public handle(clickResponse: StreamResponse): void {
    const response = this.clickContext.getResponseAdapter()
    const clickData = this.clickContext.getClickData()

    response.send({ ...clickResponse, clickData })
  }
}
