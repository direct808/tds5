import { StreamBuilder, StreamFull } from './stream-builder'
import { StreamOfferBuilder, StreamOfferFull } from '../stream-offer-builder'
import { StreamSchemaEnum } from '@generated/prisma/enums'
import { PrismaClient } from '@generated/prisma/client'

export class StreamTypeOffersBuilder extends StreamBuilder {
  private streamOffersBuilders: StreamOfferBuilder[] = []

  constructor() {
    super()
    this.fields.schema = StreamSchemaEnum.LANDINGS_OFFERS
  }

  addOffer(callback: (builder: StreamOfferBuilder) => void): this {
    const builder = StreamOfferBuilder.create()
    this.streamOffersBuilders.push(builder)
    callback(builder)

    return this
  }

  async save(prisma: PrismaClient, campaignId: string): Promise<StreamFull> {
    const streamOffers: StreamOfferFull[] = []
    const result = (await super.save(prisma, campaignId)) as StreamFull

    for (const builder of this.streamOffersBuilders) {
      const streamOffer = await builder.save(prisma, result.id)
      streamOffers.push(streamOffer)
    }
    result.streamOffers = streamOffers

    return result
  }
}
