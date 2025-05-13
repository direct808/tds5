import { Test, TestingModule } from '@nestjs/testing'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { OfferRepository } from '../../offer/offer.repository'

describe('CommonStreamService', () => {
  let service: CommonStreamOfferService

  const offerRepository = {
    getByIdsAndUserId: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonStreamOfferService,
        {
          provide: OfferRepository,
          useValue: offerRepository,
        },
      ],
    }).compile()

    service = module.get(CommonStreamOfferService)

    jest.clearAllMocks()
  })

  describe('checkPercentSum', () => {
    it('should be an error if sum of percent is less than 100', () => {
      expect(() =>
        service.checkPercentSum([
          {
            offerId: 'offer-id',
            active: true,
            percent: 75,
          },
          {
            offerId: 'offer-id',
            active: true,
            percent: 15,
          },
        ]),
      ).toThrow('Sum of the percentages should be 100')
    })

    it('should be an error if sum of percent is 100, inactive items are not taken', () => {
      expect(() =>
        service.checkPercentSum([
          {
            offerId: 'offer-id',
            active: true,
            percent: 75,
          },
          {
            offerId: 'offer-id',
            active: true,
            percent: 25,
          },
          {
            offerId: 'offer-id',
            active: false,
            percent: 25,
          },
        ]),
      ).not.toThrow()
    })
  })

  it('check buildCreateData', () => {
    const result = service.buildCreateData('stream-1', [
      {
        offerId: 'offer-id',
        active: true,
        percent: 75,
      },
      {
        offerId: 'offer-id',
        active: false,
        percent: 25,
      },
    ])

    expect(result).toEqual([
      {
        streamId: 'stream-1',
        offerId: 'offer-id',
        active: true,
        percent: 75,
      },
      {
        streamId: 'stream-1',
        offerId: 'offer-id',
        active: false,
        percent: 25,
      },
    ])
  })

  describe('checkForRepeatOffers', () => {
    it('should be an error if offer is repeatable', () => {
      expect(() =>
        service.checkForRepeatOffers([
          {
            offerId: 'offer-1',
          },
          {
            offerId: 'offer-1',
          },
        ]),
      ).toThrow('Offers should not be repeated')
    })

    it('should not be an error if offer is not repeatable', () => {
      expect(() =>
        service.checkForRepeatOffers([
          {
            offerId: 'offer-1',
          },
          {
            offerId: 'offer-2',
          },
        ]),
      ).not.toThrow()
    })
  })

  describe('ensureOffersExists', () => {
    it('should be an error if offers not exists', () => {
      offerRepository.getByIdsAndUserId.mockReturnValue([])
      expect(() =>
        service.ensureOffersExists([{ offerId: 'offer-1' }], 'user-id'),
      ).rejects.toThrow('Some offers not found')
    })

    it('should not be an error if offers exists', () => {
      offerRepository.getByIdsAndUserId.mockReturnValue([
        { offerId: 'offer-1' },
      ])
      expect(
        service.ensureOffersExists([{ offerId: 'offer-1' }], 'user-id'),
      ).resolves.not.toThrow()
    })
  })
})
