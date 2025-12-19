import { Injectable } from '@nestjs/common'
import * as weighted from 'weighted'
import { OfferFull, StreamOfferFull } from '@/domain/campaign/types'

@Injectable()
export class SelectOfferService {
  select(streamOffers: StreamOfferFull[]): OfferFull {
    if (streamOffers.length === 0) {
      throw new Error('No streamOffers')
    }

    if (streamOffers.length === 1 && streamOffers[0]) {
      return this.getOffer(streamOffers[0])
    }

    const streamOffer = weighted.select(
      streamOffers,
      streamOffers.map((o) => o.percent),
    )

    return this.getOffer(streamOffer)
  }

  private getOffer(streamOffers: StreamOfferFull): OfferFull {
    if (!streamOffers.offer) {
      throw new Error('No offer in streamOffers')
    }

    return streamOffers.offer
  }
}
