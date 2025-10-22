import { DataSource } from 'typeorm'
import { Click } from '@/domain/click/click.entity'
import { ConversionBuilder } from './conversion-builder'
import { faker } from '@faker-js/faker/.'

export class ClickBuilder {
  private readonly fields: Partial<Click> = {}

  private readonly conversions: ConversionBuilder[] = []

  private constructor(fields: Partial<Click> = {}) {
    this.fields = fields
    this.fields.id = faker.string.alphanumeric(12)
    this.fields.visitorId = faker.string.alphanumeric(6)
  }

  static create(fields: Partial<Click> = {}): ClickBuilder {
    return new this(fields)
  }

  addConv(cb: (builder: ConversionBuilder) => void): this {
    const builder = ConversionBuilder.create()
    this.conversions.push(builder)
    cb(builder)

    return this
  }

  id(id: string): this {
    this.fields.id = id

    return this
  }

  campaignId(campaignId: string): this {
    this.fields.campaignId = campaignId

    return this
  }

  streamId(streamId: string): this {
    this.fields.streamId = streamId

    return this
  }

  visitorId(visitorId: string): this {
    this.fields.visitorId = visitorId

    return this
  }

  cost(cost: number): this {
    this.fields.cost = cost

    return this
  }

  createdAt(createdAt: Date): this {
    this.fields.createdAt = createdAt

    return this
  }

  async save(ds: DataSource): Promise<Click> {
    const click = await ds.getRepository(Click).save(this.fields)
    click.conversions = []
    for (const builder of this.conversions) {
      const conversion = await builder.clickId(click.id).save(ds)
      click.conversions.push(conversion)
    }

    return click
  }
}
