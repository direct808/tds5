import { Stream } from '@/campaign/entity/stream.entity'
import { DataSource } from 'typeorm'
import { Filters } from '@/stream-filter/types'

export abstract class StreamBuilder {
  protected readonly fields: Partial<Stream> = {}

  name(name: string) {
    this.fields.name = name
    return this
  }

  filters(filters: Filters) {
    this.fields.filters = filters
    return this
  }

  async save(ds: DataSource, campaignId: string): Promise<Stream> {
    return ds
      .getRepository(Stream)
      .save({ ...this.fields, campaignId: campaignId })
  }
}
