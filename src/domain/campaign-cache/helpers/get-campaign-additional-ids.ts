import { FullCampaign } from '@/domain/campaign/types'

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
