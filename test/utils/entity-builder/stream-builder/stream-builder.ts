import { Stream } from '@/domain/campaign/entity/stream.entity'
import { DataSource } from 'typeorm'
import { Filters } from '@/domain/click/stream/filter/types'

export abstract class StreamBuilder {
  protected readonly fields: Partial<Stream> = {}

  protected constructor() {}

  name(name: string): this {
    this.fields.name = name

    return this
  }

  filters(filters: Filters): this {
    this.fields.filters = filters

    return this
  }

  async save(ds: DataSource, campaignId: string): Promise<Stream> {
    return ds
      .getRepository(Stream)
      .save({ ...this.fields, campaignId: campaignId })
  }
}
