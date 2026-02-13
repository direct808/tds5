import { FullCampaign } from '../../campaign/types'
import { OfferModel } from '@generated/prisma/models/Offer'
import { isNullable } from '@/shared/helpers'

type Args = {
  sourceId: string | null
  offerIds: string[]
  affiliateNetworkIdIds: string[]
}

export function getCampaignAdditionalIds(campaign: FullCampaign): Args {
  const sourceId = campaign.sourceId
  const offerIds: string[] = []
  const affiliateNetworkIdIds: string[] = []

  for (const stream of campaign.streams) {
    if (!isNullable(stream.streamOffers)) {
      for (const streamOffer of stream.streamOffers) {
        addIds(streamOffer.offer, offerIds, affiliateNetworkIdIds)
      }
    }
  }

  return { sourceId, offerIds, affiliateNetworkIdIds }
}

function addIds(
  offer: OfferModel,
  offerIds: string[],
  affiliateNetworkIdIds: string[],
): void {
  if (isNullable(offer)) {
    throw new Error('Offer not included')
  }
  offerIds.push(offer.id)

  if (!isNullable(offer.affiliateNetworkId)) {
    affiliateNetworkIdIds.push(offer.affiliateNetworkId)
  }
}
