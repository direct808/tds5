import { Injectable } from '@nestjs/common'
import {
  CampaignStreamSchema,
  Stream,
  StreamDirectUrl,
} from '../campaign/entity/stream.entity'
import { ClickContext, StreamResponse } from './types'
import { DirectUrlService } from './schema/direct-url/direct-url.service'
import { ActionService } from './schema/action/action.service'

@Injectable()
export class HandleStreamService {
  constructor(
    private readonly directUrlService: DirectUrlService,
    private readonly actionService: ActionService,
  ) {}

  public async handleStream(
    stream: Stream,
    cContext: ClickContext,
  ): Promise<StreamResponse> {
    switch (stream.schema) {
      case CampaignStreamSchema.ACTION:
        return this.actionService.handle(stream, cContext)
      case CampaignStreamSchema.LANDINGS_OFFERS:
        return this.handleLandingsOffers()
      case CampaignStreamSchema.DIRECT_URL:
        return this.directUrlService.handle(stream as StreamDirectUrl)
    }
  }

  private handleLandingsOffers() {
    return {
      status: 200,
      content: 'Content',
    }
  }
}
