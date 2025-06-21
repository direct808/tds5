import * as weighted from 'weighted'
import { ClickContext, StreamResponse } from '../../types'
import { Stream } from '../../../campaign/entity/stream.entity'
import { StreamOffer } from '../../../campaign/entity/stream-offer.entity'
import { HttpStatus } from '@nestjs/common'
import { ClickData } from '../../click-data'
import { Offer } from '../../../offer/offer.entity'

export class LandingsOffersService {
  public async handle(
    cContext: ClickContext,
    stream: Stream,
  ): Promise<StreamResponse> {
    if (!stream.streamOffers || !stream.streamOffers.length) {
      throw new Error('No streamOffers')
    }

    const streamOffer = this.selectStreamOffer(stream.streamOffers)

    if (!streamOffer.offer) {
      throw new Error('No offer')
    }

    this.setClickData(cContext.clickData, streamOffer.offer)

    return {
      status: HttpStatus.MOVED_PERMANENTLY,
      url: streamOffer.offer.url,
    }
  }

  private selectStreamOffer(streamOffers: StreamOffer[]): StreamOffer {
    if (streamOffers.length === 1) {
      return streamOffers[0]
    }

    return weighted.select(
      streamOffers,
      streamOffers.map((o) => o.percent),
    )
  }

  private setClickData(clickData: ClickData, offer: Offer): void {
    clickData.offerId = offer.id
    clickData.affiliateNetworkId = offer.affiliateNetworkId
  }
}
