import { ResponseHandler } from '../types'
import { Injectable } from '@nestjs/common'
import { ClickContext } from '@/domain/click/shared/click-context.service'

/**
 * Handler for debug, without real redirects
 */
@Injectable()
export class JsonResponseHandler implements ResponseHandler {
  constructor(private readonly clickContext: ClickContext) {}

  public handle: ResponseHandler['handle'] = (streamResponse) => {
    const response = this.clickContext.getResponseAdapter()
    const clickData = this.clickContext.getClickData()

    response.send({ ...streamResponse, clickData })
  }
}
