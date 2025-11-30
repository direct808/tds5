import { AffiliateNetworkBuilder } from './affiliate-network-builder'
import { PrismaClient } from '@generated/prisma/client'
import {
  OfferGetPayload,
  OfferUncheckedCreateInput,
} from '@generated/prisma/models/Offer'
import { AffiliateNetworkModel } from '@generated/prisma/models/AffiliateNetwork'

export type OfferFull = OfferGetPayload<{ include: { affiliateNetwork: true } }>

export class OfferBuilder {
  private fields: OfferUncheckedCreateInput = {} as OfferUncheckedCreateInput
  private affiliateNetworkBuilder: AffiliateNetworkBuilder | undefined

  private constructor() {}

  public static create(): OfferBuilder {
    return new this()
  }

  name(name: string): this {
    this.fields.name = name

    return this
  }

  url(name: string): this {
    this.fields.url = name

    return this
  }

  userId(userId: string): this {
    this.fields.userId = userId

    return this
  }

  async save(prisma: PrismaClient): Promise<OfferFull> {
    let affiliateNetwork: AffiliateNetworkModel | null = null

    if (this.affiliateNetworkBuilder) {
      affiliateNetwork = await this.affiliateNetworkBuilder.save(prisma)
      this.fields.affiliateNetworkId = affiliateNetwork.id
    }

    const offer = (await prisma.offer.create({
      data: this.fields,
    })) as OfferFull

    offer.affiliateNetwork = affiliateNetwork

    return offer
  }

  public createAffiliateNetwork(
    callback: (builder: AffiliateNetworkBuilder) => void,
  ): this {
    const builder = AffiliateNetworkBuilder.create()
    this.affiliateNetworkBuilder = builder
    callback(builder)

    return this
  }

  public affiliateNetworkId(affiliateNetworkId: string): this {
    this.fields.affiliateNetworkId = affiliateNetworkId

    return this
  }
}
