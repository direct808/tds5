import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { Stream } from '../campaign/entity/stream.entity'

export type StreamResponse = StreamContentResponse | StreamRedirectResponse

export type StreamContentResponse = {
  status?: HttpStatus
  content: string
}

export type StreamRedirectResponse = {
  status: HttpStatus
  url: string
}

export interface RedirectType {
  handle(url: string): Promise<StreamResponse>
}

export interface ActionType {
  handle(stream: Stream): Promise<StreamResponse>
}

export interface ResponseHandler {
  handle(httpResponse: Response, clickResponse: StreamResponse): void
}
