import { CampaignStreamSchema } from '@/campaign/entity/stream.entity.js'
import { StreamBuilder } from './stream-builder.js'
import { StreamOfferBuilder } from '../stream-offer-builder.js'
import { DataSource } from 'typeorm'
import { StreamOffer } from '@/campaign/entity/stream-offer.entity.js'

export class StreamTypeOffersBuilder extends StreamBuilder {
  private streamOffersBuilders: StreamOfferBuilder[] = []

  constructor() {
    super()
    this.fields.schema = CampaignStreamSchema.LANDINGS_OFFERS
  }

  addOffer(callback: (builder: StreamOfferBuilder) => void) {
    const builder = new StreamOfferBuilder()
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
