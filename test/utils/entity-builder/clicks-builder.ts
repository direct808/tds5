import { DataSource } from 'typeorm'
import { Click } from '@/domain/click/click.entity'
import { ClickBuilder } from './click-builder'

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

  async save(ds: DataSource): Promise<Click[]> {
    const result: Click[] = []
    for (const builder of this.clicks) {
      const click = await builder.save(ds)
      result.push(click)
    }

    return result
  }
}
