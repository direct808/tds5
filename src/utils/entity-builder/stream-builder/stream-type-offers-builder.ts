import { CampaignStreamSchema } from '../../../campaign/entity/stream.entity'
import { StreamBuilder } from './stream-builder'
import { StreamOfferBuilder } from '../stream-offer-builder'
import { DataSource } from 'typeorm'

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
    const result = await super.save(ds, campaignId)

    for (const builder of this.streamOffersBuilders) {
      await builder.save(ds, result.id)
    }

    return result
  }
}
