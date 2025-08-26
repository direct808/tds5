import type { HttpStatus } from '@nestjs/common'
import type { Stream } from '@/campaign/entity/stream.entity'

export type StreamResponse =
  | StreamContentResponse
  | StreamRedirectResponse
  | ToCampaignResponse

export type StreamContentResponse = {
  status?: HttpStatus
  content: string
}

export type StreamRedirectResponse = {
  status: HttpStatus
  url: string
}

export type ToCampaignResponse = {
  campaignCode: string
}

export interface RedirectType {
  handle(url: string): Promise<StreamResponse> | StreamResponse
}

export interface ActionType {
  handle(stream: Stream): Promise<StreamResponse> | StreamResponse
}

export interface ResponseHandler {
  handle(clickResponse: StreamResponse): void
}
