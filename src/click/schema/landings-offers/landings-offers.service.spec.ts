import { LandingsOffersService } from './landings-offers.service'
import { SelectOfferService } from './select-offer.service'
import { OfferParamsService } from './offer-params.service'
import { OfferParamDataMapper } from './offer-params-data-mapper'
import { ClickContext } from '../../types'
import { Stream } from '@/campaign/entity/stream.entity'
import { Offer } from '@/offer/offer.entity'
import { HttpStatus } from '@nestjs/common'
import { Campaign } from '@/campaign/entity/campaign.entity'
import { ClickData } from '../../click-data'
import { StreamOffer } from '@/campaign/entity/stream-offer.entity'

describe('LandingsOffersService', () => {
  let service: LandingsOffersService
  let selectOfferService: SelectOfferService
  let offerParamsService: OfferParamsService
  let offerParamDataMapper: OfferParamDataMapper

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

    service = new LandingsOffersService(
      selectOfferService,
      offerParamsService,
      offerParamDataMapper,
    )
  })

  describe('handle', () => {
    it('should throw error if streamOffers is empty', async () => {
      const stream: Stream = { streamOffers: [] as StreamOffer[] } as Stream
      const cContext: ClickContext = {} as ClickContext

      await expect(service.handle(cContext, stream)).rejects.toThrow(
        'No streamOffers',
      )
    })

    it('should throw error if streamOffers is null', async () => {
      const stream: Stream = { streamOffers: null } as Stream
      const cContext: ClickContext = {} as ClickContext

      await expect(service.handle(cContext, stream)).rejects.toThrow(
        'No streamOffers',
      )
    })

    it('should select offer and build redirect url', async () => {
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

      const stream: Stream = {
        streamOffers: [{} as any],
        campaign,
      } as Stream

      const clickData: ClickData = {} as ClickData
      const cContext: ClickContext = { clickData } as ClickContext

      ;(selectOfferService.select as jest.Mock).mockReturnValue(offer)

      const buildOfferUrl = jest
        .spyOn(service as any, 'buildOfferUrl')
        .mockReturnValue(resultUrl)
      const setClickData = jest.spyOn(service as any, 'setClickData')

      const result = await service.handle(cContext, stream)

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
    it('should return offerUrl if offerParams is empty', async () => {
      const res = service['buildOfferUrl'](
        undefined,
        {} as Campaign,
        'offerUrl',
        {},
      )

      expect(res).toBe('offerUrl')
    })

    it('should return value', async () => {
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
