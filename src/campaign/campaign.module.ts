import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CommonCampaignService } from './common-campaign.service'
import { CreateCampaignService } from './create-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'
import { UpdateStreamService } from './stream/update-stream.service'
import { CreateStreamOfferService } from './stream-offer/create-stream-offer.service'
import { CreateStreamService } from './stream/create-stream.service'
import { CommonStreamService } from './stream/common-stream.service'
import { StreamRepository } from './stream/stream.repository'
import { UpdateStreamOfferService } from './stream-offer/update-stream-offer.service'
import { StreamOfferRepository } from './stream-offer/stream-offer.repository'
import { CommonStreamOfferService } from './stream-offer/common-stream-offer.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  controllers: [CampaignController],
  imports: [RepositoryModule],
  providers: [
    CommonCampaignService,
    CreateCampaignService,
    UpdateCampaignService,
    UpdateStreamService,
    CreateStreamOfferService,
    CreateStreamService,
    CommonStreamService,
    StreamRepository,
    UpdateStreamOfferService,
    StreamOfferRepository,
    CommonStreamOfferService,
  ],
})
export class CampaignModule {}
