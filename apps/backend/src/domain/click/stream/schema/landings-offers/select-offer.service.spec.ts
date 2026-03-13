import { SelectOfferService } from './select-offer.service'
import * as weighted from 'weighted'
import { OfferModel } from '@generated/prisma/models/Offer'
import { StreamOfferFull } from '@/domain/campaign/types'

jest.mock('weighted')

describe('SelectOfferService', () => {
  let service: SelectOfferService

  beforeEach(() => {
    service = new SelectOfferService()
  })

  describe('select', () => {
    it('should throw exception if no streamOffer', () => {
      expect(() => service.select([])).toThrowError('No streamOffers')
    })

    it('should return the offer if only one streamOffer exists', () => {
      const offer: OfferModel = { id: '1' } as OfferModel
      const streamOffer: StreamOfferFull = {
        offer,
        percent: 100,
      } as StreamOfferFull

      const result = service.select([streamOffer])

      expect(result).toBe(offer)
    })

    it('should select an offer using weighted.select if multiple streamOffers exist', () => {
      const offer1: OfferModel = { id: '1' } as OfferModel
      const offer2: OfferModel = { id: '2' } as OfferModel

      const streamOffer1: StreamOfferFull = {
        offer: offer1,
        percent: 30,
      } as StreamOfferFull

      const streamOffer2: StreamOfferFull = {
        offer: offer2,
        percent: 70,
      } as StreamOfferFull

      ;(weighted.select as unknown as jest.Mock).mockReturnValue(streamOffer2)

      const result = service.select([streamOffer1, streamOffer2])

      expect(weighted.select).toHaveBeenCalledWith(
        [streamOffer1, streamOffer2],
        [30, 70],
      )
      expect(result).toBe(offer2)
    })
  })

  describe('getOffer', () => {
    it('should return offer', () => {
      const offer = { id: '1' }
      const streamOffer: StreamOfferFull = {
        offer,
        percent: 100,
      } as StreamOfferFull

      const result = service['getOffer'](streamOffer)
      expect(result).toEqual(offer)
    })

    it('should throw an error if selected streamOffer has no offer', () => {
      const streamOffer = {
        percent: 100,
      } as StreamOfferFull

      expect(() => service['getOffer'](streamOffer)).toThrowError(
        'No offer in streamOffers',
      )
    })
  })
})
