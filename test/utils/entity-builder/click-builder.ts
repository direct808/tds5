import { DataSource } from 'typeorm'
import { Click } from '@/domain/click/click.entity'

export class ClickBuilder {
  private readonly fields: Partial<Click> = {}

  private constructor(fields: Partial<Click> = {}) {
    this.fields = fields
  }

  static create(fields: Partial<Click> = {}): ClickBuilder {
    return new this(fields)
  }

  id(id: string): this {
    this.fields.id = id

    return this
  }

  campaignId(campaignId: string): this {
    this.fields.campaignId = campaignId

    return this
  }

  visitorId(visitorId: string): this {
    this.fields.visitorId = visitorId

    return this
  }

  createdAt(createdAt: Date): this {
    this.fields.createdAt = createdAt

    return this
  }

  async save(ds: DataSource): Promise<Click> {
    return ds.getRepository(Click).save(this.fields)
  }
}
