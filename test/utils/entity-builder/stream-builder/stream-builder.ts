import { Filters } from '@/domain/click/stream/filter/types'
import { PrismaClient } from '../../../../generated/prisma/client'
import {
  StreamGetPayload,
  StreamUncheckedCreateInput,
} from '../../../../generated/prisma/models/Stream'

export type StreamFull = StreamGetPayload<{
  include: {
    streamOffers: {
      include: { offer: { include: { affiliateNetwork: true } } }
    }
    actionCampaign: true
  }
}>

export abstract class StreamBuilder {
  protected readonly fields = {} as StreamUncheckedCreateInput

  protected constructor() {}

  name(name: string): this {
    this.fields.name = name

    return this
  }

  filters(filters: Filters): this {
    this.fields.filters = filters as any // todo проверить

    return this
  }

  async save(prisma: PrismaClient, campaignId: string): Promise<StreamFull> {
    const res = await prisma.stream.create({
      data: { ...this.fields, campaignId: campaignId },
    })

    return res as StreamFull
  }
}
