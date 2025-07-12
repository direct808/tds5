import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { ResponseHandler, StreamResponse } from '../types.js'
import { HttpResponseHandler } from './http-response-handler.js'
import { JsonResponseHandler } from './json-response-handler.js'
import { ClickContext } from '@/click/shared/click-context.service.js'

@Injectable()
export class ResponseHandlerFactory {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly clickContext: ClickContext,
  ) {}

  public handle(clickResponse: StreamResponse) {
    return this.create().handle(clickResponse)
  }

  private create(): ResponseHandler {
    const request = this.clickContext.getRequestAdapter()
    if (request.query('json_response')) {
      return this.moduleRef.get(JsonResponseHandler)
    }
    return this.moduleRef.get(HttpResponseHandler)
  }
}
