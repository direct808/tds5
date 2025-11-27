import { OfferBuilder, OfferFull } from './offer-builder'
import { PrismaClient } from '../../../generated/prisma/client'
import {
  StreamOfferGetPayload,
  StreamOfferUncheckedCreateInput,
} from '../../../generated/prisma/models/StreamOffer'
import { OfferModel } from '../../../generated/prisma/models/Offer'

export type StreamOfferFull = StreamOfferGetPayload<{
  include: { offer: { include: { affiliateNetwork: true } } }
}>

export class StreamOfferBuilder {
  private fields: StreamOfferUncheckedCreateInput = {
    active: true,
  } as StreamOfferUncheckedCreateInput

  private builder?: OfferBuilder

  private constructor() {}

  public static create(): StreamOfferBuilder {
    return new this()
  }

  percent(value: number): StreamOfferBuilder {
    this.fields.percent = value

    return this
  }

  createOffer(callback: (builder: OfferBuilder) => void): StreamOfferBuilder {
    const builder = OfferBuilder.create()
    this.builder = builder
    callback(builder)

    return this
  }

  offerId(offerId: string): StreamOfferBuilder {
    this.fields.offerId = offerId

    return this
  }

  async save(prisma: PrismaClient, streamId: string): Promise<StreamOfferFull> {
    this.fields.streamId = streamId
    let offer: OfferFull | undefined

    if (this.builder) {
      const off = await this.builder.save(prisma)
      this.fields.offerId = off.id
      offer = off
    }

    const res = (await prisma.streamOffer.create({
      data: this.fields,
    })) as StreamOfferFull

    if (offer) {
      res.offer = offer
    }

    return res as StreamOfferFull
  }
}
