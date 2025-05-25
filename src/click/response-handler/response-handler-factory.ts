import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Response } from 'express'
import { ResponseHandler, StreamResponse } from '../types'
import { HttpResponseHandler } from './http-response-handler'
import { JsonResponseHandler } from './json-response-handler'

@Injectable()
export class ResponseHandlerFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  public handle(
    query: Record<string, string>,
    httpResponse: Response,
    clickResponse: StreamResponse,
  ) {
    return this.create(query).handle(httpResponse, clickResponse)
  }

  private create(query: Record<string, string>): ResponseHandler {
    if (query.json_response) {
      return this.moduleRef.get(JsonResponseHandler)
    }
    return this.moduleRef.get(HttpResponseHandler)
  }
}
