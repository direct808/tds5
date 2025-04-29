import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CampaignService } from './campaign.service'
import { CampaignRepository } from './campaign.repository'
import { StreamService } from './stream.service'
import { StreamRepository } from './stream.repository'
import { SourceModule } from '../source'

@Module({
  controllers: [CampaignController],
  imports: [SourceModule],
  providers: [
    CampaignService,
    StreamService,
    CampaignRepository,
    StreamRepository,
  ],
})
export class CampaignModule {}
