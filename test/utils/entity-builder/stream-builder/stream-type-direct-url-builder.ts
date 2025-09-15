import {
  CampaignStreamSchema,
  StreamRedirectType,
} from '@/domain/campaign/types'
import { StreamBuilder } from './stream-builder'

export class StreamTypeDirectUrlBuilder extends StreamBuilder {
  constructor() {
    super()
    this.fields.schema = CampaignStreamSchema.DIRECT_URL
  }

  redirectType(type: StreamRedirectType) {
    this.fields.redirectType = type

    return this
  }

  url(url: string) {
    this.fields.redirectUrl = url

    return this
  }
}
