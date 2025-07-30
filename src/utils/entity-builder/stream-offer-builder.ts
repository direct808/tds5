import { StreamOffer } from '@/campaign/entity/stream-offer.entity'
import { OfferBuilder } from './offer-builder'
import { DataSource } from 'typeorm'

export class StreamOfferBuilder {
  private fields: Partial<StreamOffer> = { active: true }
  private builder?: OfferBuilder

  percent(value: number) {
    this.fields.percent = value
    return this
  }

  createOffer(callback: (builder: OfferBuilder) => void) {
    const builder = OfferBuilder.create()
    this.builder = builder
    callback(builder)
    return this
  }

  async save(ds: DataSource, streamId: string) {
    this.fields.streamId = streamId
    if (this.builder) {
      const offer = await this.builder.save(ds)
      this.fields.offerId = offer.id
      this.fields.offer = offer
    }

    return ds.getRepository(StreamOffer).save(this.fields)
  }
}
