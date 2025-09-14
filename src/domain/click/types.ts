import type { HttpStatus } from '@nestjs/common'
import type { Stream } from '@/domain/campaign/entity/stream.entity'
import { MaybePromise } from '@/utils/types'

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
  handle(url: string): MaybePromise<StreamResponse>
}

export interface ActionType {
  handle(stream: Stream): MaybePromise<StreamResponse>
}

export interface ResponseHandler {
  handle(clickResponse: StreamResponse): void
}
