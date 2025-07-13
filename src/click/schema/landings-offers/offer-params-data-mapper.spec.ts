import { OfferParamDataMapper } from './offer-params-data-mapper.js'
import { Campaign } from '../../../campaign/entity/campaign.entity.js'
import { ClickData } from '../../click-data.js'
import { OfferParams } from './offer-params.service.js'

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
