import type { HttpStatus } from '@nestjs/common'
import type { Stream } from '@/campaign/entity/stream.entity'
// import type { ClickData } from './click-data'
// import { RequestAdapter, ResponseAdapter } from '@/utils/request-adapter'

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

// export type ClickContext = {
//   code: string
//   request: RequestAdapter
//   response: ResponseAdapter
//   redirectCount: number
//   clickData: ClickData
// }

export interface RedirectType {
  handle(url: string): Promise<StreamResponse>
}

export interface ActionType {
  handle(stream: Stream): Promise<StreamResponse>
}

export interface ResponseHandler {
  handle(clickResponse: StreamResponse): void
}
