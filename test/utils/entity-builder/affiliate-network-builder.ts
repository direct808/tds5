import { PrismaClient } from '../../../generated/prisma/client'
import {
  AffiliateNetworkModel,
  AffiliateNetworkUncheckedCreateInput,
} from '../../../generated/prisma/models/AffiliateNetwork'

export class AffiliateNetworkBuilder {
  private fields: AffiliateNetworkUncheckedCreateInput =
    {} as AffiliateNetworkUncheckedCreateInput

  private constructor() {}

  public static create(): AffiliateNetworkBuilder {
    return new this()
  }

  name(name: string): this {
    this.fields.name = name

    return this
  }

  userId(userId: string): this {
    this.fields.userId = userId

    return this
  }

  offerParams(offerParams: string): this {
    this.fields.offerParams = offerParams

    return this
  }

  save(prisma: PrismaClient): Promise<AffiliateNetworkModel> {
    return prisma.affiliateNetwork.create({
      data: this.fields as AffiliateNetworkUncheckedCreateInput,
    })
  }
}
