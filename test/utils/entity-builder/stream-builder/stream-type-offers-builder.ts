import { CampaignStreamSchema } from '@/campaign/types'
import { StreamBuilder } from './stream-builder'
import { StreamOfferBuilder } from '../stream-offer-builder'
import { DataSource } from 'typeorm'
import { StreamOffer } from '@/campaign/entity/stream-offer.entity'

export class StreamTypeOffersBuilder extends StreamBuilder {
  private streamOffersBuilders: StreamOfferBuilder[] = []

  constructor() {
    super()
    this.fields.schema = CampaignStreamSchema.LANDINGS_OFFERS
  }

  addOffer(callback: (builder: StreamOfferBuilder) => void) {
    const builder = StreamOfferBuilder.create()
    this.streamOffersBuilders.push(builder)
    callback(builder)

    return this
  }

  async save(ds: DataSource, campaignId: string) {
    const streamOffers: StreamOffer[] = []
    const result = await super.save(ds, campaignId)

    for (const builder of this.streamOffersBuilders) {
      const streamOffer = await builder.save(ds, result.id)
      streamOffers.push(streamOffer)
    }
    result.streamOffers = streamOffers

    return result
  }
}
