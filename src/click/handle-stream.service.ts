import { Injectable } from '@nestjs/common'
import {
  CampaignStreamSchema,
  Stream,
  StreamDirectUrl,
} from '../campaign/entity/stream.entity'
import { StreamResponse } from './types'
import { DirectUrlService } from './schema/direct-url/direct-url.service'

@Injectable()
export class HandleStreamService {
  constructor(private readonly directUrlService: DirectUrlService) {}

  public async handleStream(stream: Stream): Promise<StreamResponse> {
    switch (stream.schema) {
      case CampaignStreamSchema.ACTION:
        return this.handleAction()
      case CampaignStreamSchema.LANDINGS_OFFERS:
        return this.handleLandingsOffers()
      case CampaignStreamSchema.DIRECT_URL:
        return this.directUrlService.handle(stream as StreamDirectUrl)
    }
  }

  private handleAction() {
    return {
      status: 200,
      content: 'Content',
    }
  }

  private handleLandingsOffers() {
    return {
      status: 200,
      content: 'Content',
    }
  }
}
