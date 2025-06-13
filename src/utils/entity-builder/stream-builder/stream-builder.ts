import { Stream } from '../../../campaign/entity/stream.entity'
import { DataSource } from 'typeorm'

export abstract class StreamBuilder {
  protected readonly fields: Partial<Stream> = {}

  name(name: string) {
    this.fields.name = name
    return this
  }

  async save(ds: DataSource, campaignId: string): Promise<Stream> {
    return ds
      .getRepository(Stream)
      .save({ ...this.fields, campaignId: campaignId })
  }
}
