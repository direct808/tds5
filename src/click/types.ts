import { HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { Stream } from '../campaign/entity/stream.entity'
import { ClickData } from './click-data'

export type StreamResponse = StreamContentResponse | StreamRedirectResponse

export type StreamContentResponse = {
  status?: HttpStatus
  content: string
}

export type StreamRedirectResponse = {
  status: HttpStatus
  url: string
}

export type ClickContext = {
  code: string
  request: Request
  response: Response
  query: Record<string, string>
  redirectCount: number
  clickData: ClickData
}

export interface RedirectType {
  handle(url: string): Promise<StreamResponse>
}

export interface ActionType {
  handle(stream: Stream, cRequest: ClickContext): Promise<StreamResponse>
}

export interface ResponseHandler {
  handle(cRequest: ClickContext, clickResponse: StreamResponse): void
}
