import { LandingsOffersService } from './landings-offers.service'
import { SelectOfferService } from './select-offer.service'
import { OfferParamsService } from './offer-params.service'
import { OfferParamDataMapper } from './offer-params-data-mapper'
import { StreamWithCampaign } from '@/domain/campaign/types'
import { Offer } from '@/domain/offer/offer.entity'
import { HttpStatus } from '@nestjs/common'
import { Campaign } from '@/domain/campaign/entity/campaign.entity'
import { StreamOffer } from '@/domain/campaign/entity/stream-offer.entity'
import { MockClickContext } from '../../../../../../test/utils/mock-click-context.service'

describe('LandingsOffersService', () => {
  let service: LandingsOffersService
  let selectOfferService: SelectOfferService
  let offerParamsService: OfferParamsService
  let offerParamDataMapper: OfferParamDataMapper
  let clickContext: MockClickContext

  beforeEach(() => {
    selectOfferService = {
      select: jest.fn(),
    } as any

    offerParamsService = {
      buildOfferUrl: jest.fn(),
    } as any

    offerParamDataMapper = {
      convert: jest.fn(),
    } as any

    clickContext = MockClickContext.create().createClickData()

    service = new LandingsOffersService(
      selectOfferService,
      offerParamsService,
      offerParamDataMapper,
      clickContext,
    )
  })

  describe('handle', () => {
    it('should throw error if streamOffers is empty', () => {
      const stream: StreamWithCampaign = {
        streamOffers: [] as StreamOffer[],
      } as StreamWithCampaign

      expect(() => service.handle(stream)).toThrow('No streamOffers')
    })

    it('should throw error if streamOffers is null', () => {
      const stream: StreamWithCampaign = {
        streamOffers: null,
      } as StreamWithCampaign

      expect(() => service.handle(stream)).toThrow('No streamOffers')
    })

    it('should select offer and build redirect url', () => {
      const offerParams = 'subid={subid}&campaign={campaign_name}'
      const campaign = { name: 'TestCampaign' } as Campaign
      const offerUrl = 'https://example.com'
      const resultUrl =
        'https://example.com?subid=click123&campaign=TestCampaign'
      const offer: Offer = {
        id: '1',
        affiliateNetworkId: '2',
        url: offerUrl,
        affiliateNetwork: {
          offerParams,
        } as any,
      } as Offer

      const stream: StreamWithCampaign = {
        streamOffers: [{} as any],
        campaign,
      } as StreamWithCampaign

      const clickData = clickContext.getClickData()

      ;(selectOfferService.select as jest.Mock).mockReturnValue(offer)

      const buildOfferUrl = jest
        .spyOn(service as any, 'buildOfferUrl')
        .mockReturnValue(resultUrl)
      const setClickData = jest.spyOn(service as any, 'setClickData')

      const result = service.handle(stream)

      expect(selectOfferService.select).toHaveBeenCalledWith(
        stream.streamOffers,
      )
      expect(setClickData).toHaveBeenCalledWith(clickData, offer)

      expect(buildOfferUrl).toHaveBeenCalledWith(
        offerParams,
        campaign,
        offerUrl,
        clickData,
      )

      expect(result).toStrictEqual({
        status: HttpStatus.MOVED_PERMANENTLY,
        url: resultUrl,
      })
    })
  })

  describe('buildOfferUrl', () => {
    it('should return offerUrl if offerParams is empty', () => {
      const res = service['buildOfferUrl'](
        undefined,
        {} as Campaign,
        'offerUrl',
        {},
      )

      expect(res).toBe('offerUrl')
    })

    it('should return value', () => {
      const campaign = {} as Campaign
      const clickData = {}
      const paramData = 'convertResult'
      const expectedResult = 'expectedResult'

      ;(offerParamDataMapper.convert as jest.Mock).mockReturnValue(paramData)
      ;(offerParamsService.buildOfferUrl as jest.Mock).mockReturnValue(
        expectedResult,
      )

      const res = service['buildOfferUrl'](
        'offerParams',
        campaign,
        'offerUrl',
        clickData,
      )

      expect(offerParamDataMapper.convert).toBeCalledWith({
        campaign,
        clickData,
      })

      expect(offerParamsService.buildOfferUrl).toBeCalledWith({
        offerParams: 'offerParams',
        url: 'offerUrl',
        paramData,
      })

      expect(res).toBe(expectedResult)
    })
  })
})
