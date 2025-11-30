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

// export enum CampaignStreamSchema {
//   ACTION = 'ACTION',
//   DIRECT_URL = 'DIRECT_URL',
//   LANDINGS_OFFERS = 'LANDINGS_OFFERS',
// }

// export enum StreamRedirectType {
//   CURL = 'CURL',
//   FORM_SUBMIT = 'FORM_SUBMIT',
//   HTTP = 'HTTP',
//   IFRAME = 'IFRAME',
//   JS = 'JS',
//   META = 'META',
//   META2 = 'META2',
//   REMOTE = 'REMOTE',
//   WITHOUT_REFERER = 'WITHOUT_REFERER',
// }

// export enum StreamActionType {
//   NOTHING = 'NOTHING',
//   SHOW404 = 'SHOW404',
//   SHOW_HTML = 'SHOW_HTML',
//   SHOW_TEXT = 'SHOW_TEXT',
//   TO_CAMPAIGN = 'TO_CAMPAIGN',
// }

export interface StreamDirectUrl extends StreamModel {
  redirectType: StreamRedirectTypeEnum
  redirectUrl: string
}

// export type FullCampaign = CampaignModel & { streams: StreamModel[] }
export type FullCampaign = CampaignGetPayload<{
  include: {
    streams: {
      include: {
        actionCampaign: true
        // campaign: true
        streamOffers: {
          include: { offer: { include: { affiliateNetwork: true } } }
        }
      }
    }
  }
}>
