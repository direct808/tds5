import { Injectable } from '@nestjs/common'
import {
  CampaignStreamSchema,
  Stream,
  StreamDirectUrl,
} from '../campaign/entity/stream.entity.js'
import { StreamResponse } from './types.js'
import { DirectUrlService } from './schema/direct-url/direct-url.service.js'
import { ActionService } from './schema/action/action.service.js'
import { LandingsOffersService } from './schema/landings-offers/landings-offers.service.js'

@Injectable()
export class HandleStreamService {
  constructor(
    private readonly directUrlService: DirectUrlService,
    private readonly actionService: ActionService,
    private readonly landingsOffersService: LandingsOffersService,
  ) {}

  public async handleStream(stream: Stream): Promise<StreamResponse> {
    switch (stream.schema) {
      case CampaignStreamSchema.ACTION:
        return this.actionService.handle(stream)
      case CampaignStreamSchema.LANDINGS_OFFERS:
        return this.landingsOffersService.handle(stream)
      case CampaignStreamSchema.DIRECT_URL:
        return this.directUrlService.handle(stream as StreamDirectUrl)
    }
  }
}
