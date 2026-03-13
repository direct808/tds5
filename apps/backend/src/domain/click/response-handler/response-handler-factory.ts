import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { ResponseHandler, StreamResponse } from '@/domain/click/types'
import { HttpResponseHandler } from './http-response-handler'
import { JsonResponseHandler } from './json-response-handler'
import { ClickContext } from '@/domain/click/shared/click-context.service'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class ResponseHandlerFactory {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly clickContext: ClickContext,
  ) {}

  public handle(clickResponse: StreamResponse): void {
    return this.create().handle(clickResponse)
  }

  private create(): ResponseHandler {
    const request = this.clickContext.getRequestAdapter()
    if (!isNullable(request.query('json_response'))) {
      return this.moduleRef.get(JsonResponseHandler)
    }

    return this.moduleRef.get(HttpResponseHandler)
  }
}
