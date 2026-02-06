import { Injectable } from '@nestjs/common'
import { StreamResponse } from '../../types'
import { DirectUrlService } from './direct-url/direct-url.service'
import { ActionService } from './action/action.service'
import { LandingsOffersService } from './landings-offers/landings-offers.service'
import {
  StreamDirectUrl,
  StreamFullWithCampaign,
} from '../../../campaign/types'
import { StreamSchemaEnum } from '@generated/prisma/enums'

@Injectable()
export class SchemaService {
  constructor(
    private readonly directUrlService: DirectUrlService,
    private readonly actionService: ActionService,
    private readonly landingsOffersService: LandingsOffersService,
  ) {}

  public async handle(stream: StreamFullWithCampaign): Promise<StreamResponse> {
    switch (stream.schema) {
      case StreamSchemaEnum.ACTION:
        return this.actionService.handle(stream)
      case StreamSchemaEnum.LANDINGS_OFFERS:
        return this.landingsOffersService.handle(stream)
      case StreamSchemaEnum.DIRECT_URL:
        return this.directUrlService.handle(stream as StreamDirectUrl)
    }
    throw new Error('Unsupported schema ' + stream.schema)
  }
}
