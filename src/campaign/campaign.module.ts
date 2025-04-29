import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CampaignService } from './campaign.service'
import { CampaignRepository } from './campaign.repository'
import { StreamService } from './stream.service'
import { StreamRepository } from './stream.repository'
import { SourceModule } from '../source'
import { StreamOfferService } from './stream-offer.service'
import { StreamOfferRepository } from './stream-offer.repository'
import { OfferModule } from '../offer'

@Module({
  controllers: [CampaignController],
  imports: [SourceModule, OfferModule],
  providers: [
    CampaignService,
    StreamService,
    CampaignRepository,
    StreamRepository,
    StreamOfferService,
    StreamOfferRepository,
  ],
})
export class CampaignModule {}
