import { ClickBuilder } from './click-builder'
import { PrismaClient } from '@prisma/client/extension'
import { ClickModel } from '@generated/prisma/models/Click'

export function createClicksBuilder(): ClicksBuilder {
  return ClicksBuilder.create()
}

class ClicksBuilder {
  private readonly clicks: ClickBuilder[] = []
  private _campaignId: string | undefined
  private _affiliateNetworkId: string | undefined
  private _offerId: string | undefined
  private _sourceId: string | undefined

  private constructor() {}

  static create(): ClicksBuilder {
    return new this()
  }

  campaignId(campaignId: string): this {
    this._campaignId = campaignId

    return this
  }

  affiliateNetworkId(affiliateNetworkId: string): this {
    this._affiliateNetworkId = affiliateNetworkId

    return this
  }

  offerId(offerId: string): this {
    this._offerId = offerId

    return this
  }

  sourceId(sourceId: string): this {
    this._sourceId = sourceId

    return this
  }

  add(cb?: (builder: ClickBuilder) => void): this {
    const builder = ClickBuilder.create()
    if (this._campaignId) {
      builder.campaignId(this._campaignId)
    }
    if (this._affiliateNetworkId) {
      builder.affiliateNetworkId(this._affiliateNetworkId)
    }
    if (this._offerId) {
      builder.offerId(this._offerId)
    }
    if (this._sourceId) {
      builder.sourceId(this._sourceId)
    }
    this.clicks.push(builder)
    if (cb) {
      cb(builder)
    }

    return this
  }

  async save(prisma: PrismaClient): Promise<ClickModel[]> {
    const result: ClickModel[] = []
    for (const builder of this.clicks) {
      const click = await builder.save(prisma)
      result.push(click)
    }

    return result
  }
}
