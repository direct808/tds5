import { Campaign } from '@/campaign/entity/campaign.entity'

export function getCampaignAdditionalIds(campaign: Campaign) {
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
