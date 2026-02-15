import { StreamGetPayload, StreamModel } from '@generated/prisma/models/Stream'
import { CampaignGetPayload } from '@generated/prisma/models/Campaign'
import { StreamRedirectTypeEnum } from '@generated/prisma/enums'
import { StreamOfferGetPayload } from '@generated/prisma/models/StreamOffer'
import { OfferGetPayload } from '@generated/prisma/models/Offer'

export type StreamOfferFull = StreamOfferGetPayload<{
  include: { offer: { include: { affiliateNetwork: true } } }
}>

export type OfferFull = OfferGetPayload<{
  include: { affiliateNetwork: true }
}>

export type StreamFull = StreamGetPayload<{
  include: {
    streamOffers: {
      include: { offer: { include: { affiliateNetwork: true } } }
    }
    actionCampaign: true
  }
}>

export type StreamFullWithCampaign = StreamGetPayload<{
  include: {
    campaign: true
    actionCampaign: true
    streamOffers: {
      include: { offer: { include: { affiliateNetwork: true } } }
    }
  }
}>

export interface StreamDirectUrl extends StreamModel {
  redirectType: StreamRedirectTypeEnum
  redirectUrl: string
}

export type FullCampaign = CampaignGetPayload<{
  include: {
    domain: true
    source: true
    streams: {
      include: {
        actionCampaign: true
        streamOffers: {
          include: { offer: { include: { affiliateNetwork: true } } }
        }
      }
    }
  }
}>
