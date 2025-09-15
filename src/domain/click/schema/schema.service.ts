import { Injectable } from '@nestjs/common'
import { StreamResponse } from '../types'
import { DirectUrlService } from './direct-url/direct-url.service'
import { ActionService } from './action/action.service'
import { LandingsOffersService } from './landings-offers/landings-offers.service'
import {
  CampaignStreamSchema,
  StreamDirectUrl,
  StreamWithCampaign,
} from '@/domain/campaign/types'

@Injectable()
export class SchemaService {
  constructor(
    private readonly directUrlService: DirectUrlService,
    private readonly actionService: ActionService,
    private readonly landingsOffersService: LandingsOffersService,
  ) {}

  public async handle(stream: StreamWithCampaign): Promise<StreamResponse> {
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
