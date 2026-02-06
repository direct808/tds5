import { StreamBuilder } from './stream-builder'
import {
  StreamRedirectTypeEnum,
  StreamSchemaEnum,
} from '@generated/prisma/enums'

export class StreamTypeDirectUrlBuilder extends StreamBuilder {
  constructor() {
    super()
    this.fields.schema = StreamSchemaEnum.DIRECT_URL
  }

  redirectType(type: StreamRedirectTypeEnum): this {
    this.fields.redirectType = type

    return this
  }

  url(url: string): this {
    this.fields.redirectUrl = url

    return this
  }
}
