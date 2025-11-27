import type { HttpStatus } from '@nestjs/common'
import { MaybePromise } from '@/shared/types'
import { StreamModel } from '../../../generated/prisma/models/Stream'
import { StreamOfferGetPayload } from '../../../generated/prisma/models/StreamOffer'
import { OfferGetPayload } from '../../../generated/prisma/models/Offer'

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
  handle(stream: StreamModel): MaybePromise<StreamResponse>
}

export interface ResponseHandler {
  handle(clickResponse: StreamResponse): void
}
