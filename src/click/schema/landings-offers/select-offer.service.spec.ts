import { SelectOfferService } from './select-offer.service'
import { StreamOffer } from '@/campaign/entity/stream-offer.entity'
import { Offer } from '@/offer/offer.entity'
import * as weighted from 'weighted'

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
      const offer: Offer = { id: '1' } as Offer
      const streamOffer: StreamOffer = { offer, percent: 100 } as StreamOffer

      const result = service.select([streamOffer])

      expect(result).toBe(offer)
    })

    it('should select an offer using weighted.select if multiple streamOffers exist', () => {
      const offer1: Offer = { id: '1' } as Offer
      const offer2: Offer = { id: '2' } as Offer

      const streamOffer1: StreamOffer = {
        offer: offer1,
        percent: 30,
      } as StreamOffer

      const streamOffer2: StreamOffer = {
        offer: offer2,
        percent: 70,
      } as StreamOffer

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
      const streamOffer: StreamOffer = {
        offer,
        percent: 100,
      } as StreamOffer

      const result = service['getOffer'](streamOffer)
      expect(result).toEqual(offer)
    })

    it('should throw an error if selected streamOffer has no offer', () => {
      const streamOffer: StreamOffer = {
        offer: undefined,
        percent: 100,
      } as StreamOffer

      expect(() => service['getOffer'](streamOffer)).toThrowError(
        'No offer in streamOffers',
      )
    })
  })
})
