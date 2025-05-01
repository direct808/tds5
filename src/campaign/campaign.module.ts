import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CampaignService } from './campaign.service'
import { CampaignRepository } from './campaign.repository'
import { StreamService } from './stream.service'
import { StreamRepository } from './stream.repository'
import { SourceModule } from '../source'
import { OfferModule } from '../offer'
import { StreamOfferModule } from './stream-offer'

@Module({
  controllers: [CampaignController],
  imports: [SourceModule, OfferModule, StreamOfferModule],
  providers: [
    CampaignService,
    StreamService,
    CampaignRepository,
    StreamRepository,
  ],
})
export class CampaignModule {}
