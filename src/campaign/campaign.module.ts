import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CommonCampaignService } from './common-campaign.service'
import { CampaignRepository } from './campaign.repository'
import { CreateCampaignService } from './create-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'
import { SourceModule } from '../source/source.module'

@Module({
  controllers: [CampaignController],
  imports: [SourceModule],
  providers: [
    CommonCampaignService,
    CampaignRepository,
    CreateCampaignService,
    UpdateCampaignService,
  ],
  exports: [CampaignRepository],
})
export class CampaignModule {}
