import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CommonCampaignService } from './common-campaign.service'
import { CampaignRepository } from './campaign.repository'
import { CreateCampaignService } from './create-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'
import { StreamModule } from './stream/stream.module'
import { SourceModule } from '../source/source.module'

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
