import { Injectable } from '@nestjs/common'
import * as weighted from 'weighted'
import { StreamOffer } from '@/domain/campaign/entity/stream-offer.entity'
import { Offer } from '@/domain/offer/offer.entity'

@Injectable()
export class SelectOfferService {
  select(streamOffers: StreamOffer[]): Offer {
    if (streamOffers.length === 0) {
      throw new Error('No streamOffers')
    }

    if (streamOffers.length === 1) {
      return this.getOffer(streamOffers[0])
    }

    const streamOffer = weighted.select(
      streamOffers,
      streamOffers.map((o) => o.percent),
    )

    return this.getOffer(streamOffer)
  }

  private getOffer(streamOffers: StreamOffer): Offer {
    if (!streamOffers.offer) {
      throw new Error('No offer in streamOffers')
    }

    return streamOffers.offer
  }
}
