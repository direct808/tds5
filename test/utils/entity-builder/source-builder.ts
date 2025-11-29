import { PrismaClient } from '../../../generated/prisma/client'
import {
  SourceModel,
  SourceUncheckedCreateInput,
} from '../../../generated/prisma/models/Source'

export class SourceBuilder {
  private fields: SourceUncheckedCreateInput = {} as SourceUncheckedCreateInput

  private constructor() {}

  public static create(): SourceBuilder {
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

  save(prisma: PrismaClient): Promise<SourceModel> {
    return prisma.source.create({ data: this.fields })
  }
}
