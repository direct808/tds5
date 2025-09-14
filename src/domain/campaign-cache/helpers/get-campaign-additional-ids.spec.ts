import { getCampaignAdditionalIds } from '@/domain/campaign-cache/helpers/get-campaign-additional-ids'
import { FullCampaign } from '@/domain/campaign/types'

describe('get-campaign-additional-ids.ts', () => {
  it('Should return all included ids', () => {
    const campaign: FullCampaign = {
      sourceId: 'source-id',
      streams: [
        {
          name: 'stream',
          streamOffers: [
            { offer: { id: 'offer-id-1', affiliateNetworkId: 'af-1' } },
            { offer: { id: 'offer-id-2', affiliateNetworkId: 'af-2' } },
          ],
        },
      ],
    } as FullCampaign
    const result = getCampaignAdditionalIds(campaign)

    expect(result).toStrictEqual({
      sourceId: 'source-id',
      offerIds: ['offer-id-1', 'offer-id-2'],
      affiliateNetworkIdIds: ['af-1', 'af-2'],
    })
  })

  it('Should thorw error if no offer', () => {
    const campaign: FullCampaign = {
      sourceId: 'source-id',
      streams: [
        {
          name: 'stream',
          streamOffers: [{}],
        },
      ],
    } as FullCampaign

    expect(() => getCampaignAdditionalIds(campaign)).toThrowError(
      'Offer not included',
    )
  })
})
