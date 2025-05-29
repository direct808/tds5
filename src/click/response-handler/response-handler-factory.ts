import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { ClickContext, ResponseHandler, StreamResponse } from '../types'
import { HttpResponseHandler } from './http-response-handler'
import { JsonResponseHandler } from './json-response-handler'

@Injectable()
export class ResponseHandlerFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  public handle(cRequest: ClickContext, clickResponse: StreamResponse) {
    return this.create(cRequest.query).handle(cRequest, clickResponse)
  }

  private create(query: Record<string, string>): ResponseHandler {
    if (query.json_response) {
      return this.moduleRef.get(JsonResponseHandler)
    }
    return this.moduleRef.get(HttpResponseHandler)
  }
}
