import { OfferParamDataMapper } from './offer-params-data-mapper'
import { Campaign } from '@/campaign/entity/campaign.entity'
import { ClickData } from '../../click-data'
import { OfferParams } from './offer-params.service'

describe('OfferParamDataMapper', () => {
  let mapper: OfferParamDataMapper

  beforeEach(() => {
    mapper = new OfferParamDataMapper()
  })

  it('should convert valid input to OfferParams', () => {
    const campaign: Campaign = { name: 'Test Campaign' } as Campaign
    const clickData: ClickData = { id: '12345' } as ClickData

    const result: OfferParams = mapper.convert({ campaign, clickData })

    expect(result).toEqual({
      subid: '12345',
      campaign_name: 'Test Campaign',
    })
  })

  it('should throw error if clickData.id is missing', () => {
    const campaign: Campaign = { name: 'Test Campaign' } as Campaign
    const clickData: ClickData = {} as ClickData

    expect(() => mapper.convert({ campaign, clickData })).toThrowError(
      'No click id',
    )
  })
})
