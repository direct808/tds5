import { ClickBuilder } from './click-builder'
import { PrismaClient } from '@prisma/client/extension'
import { ClickModel } from '@generated/prisma/models/Click'

export function createClicksBuilder(): ClicksBuilder {
  return ClicksBuilder.create()
}

class ClicksBuilder {
  private readonly clicks: ClickBuilder[] = []
  private _campaignId: string | undefined

  private constructor() {}

  static create(): ClicksBuilder {
    return new this()
  }

  campaignId(campaignId: string): this {
    this._campaignId = campaignId

    return this
  }

  add(cb?: (builder: ClickBuilder) => void): this {
    const builder = ClickBuilder.create()
    if (this._campaignId) {
      builder.campaignId(this._campaignId)
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
