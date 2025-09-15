import { Campaign } from '@/domain/campaign/entity/campaign.entity'

type Args = {
  sourceId: string | undefined
  offerIds: string[]
  affiliateNetworkIdIds: string[]
}

export function getCampaignAdditionalIds(campaign: Campaign): Args {
  const sourceId = campaign.sourceId
  const offerIds: string[] = []
  const affiliateNetworkIdIds: string[] = []

  for (const stream of campaign.streams) {
    if (stream.streamOffers) {
      for (const streamOffer of stream.streamOffers) {
        if (!streamOffer.offer) {
          throw new Error('Offer not included')
        }
        offerIds.push(streamOffer.offer.id)

        if (streamOffer.offer.affiliateNetworkId) {
          affiliateNetworkIdIds.push(streamOffer.offer.affiliateNetworkId)
        }
      }
    }
  }

  return { sourceId, offerIds, affiliateNetworkIdIds }
}
