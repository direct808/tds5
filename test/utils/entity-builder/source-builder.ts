import { DataSource } from 'typeorm'
import { Source } from '@/domain/source/source.entity'

export class SourceBuilder {
  private fields: Partial<Source> = {}

  private constructor() {}

  public static create() {
    return new this()
  }

  name(name: string) {
    this.fields.name = name

    return this
  }

  userId(userId: string) {
    this.fields.userId = userId

    return this
  }

  async save(ds: DataSource): Promise<Source> {
    return ds.getRepository(Source).save(this.fields)
  }
}
