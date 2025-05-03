import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CommonCampaignService } from './common-campaign.service'
import { CampaignRepository } from './campaign.repository'
import { StreamModule } from './stream'
import { SourceModule } from '../source'
import { CreateCampaignService } from './create-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'

@Module({
  controllers: [CampaignController],
  imports: [StreamModule, SourceModule],
  providers: [
    CommonCampaignService,
    CampaignRepository,
    CreateCampaignService,
    UpdateCampaignService,
  ],
  exports: [CampaignRepository],
})
export class CampaignModule {}
