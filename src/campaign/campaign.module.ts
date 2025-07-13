import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller.js'
import { CommonCampaignService } from './common-campaign.service.js'
import { CampaignRepository } from './campaign.repository.js'
import { CreateCampaignService } from './create-campaign.service.js'
import { UpdateCampaignService } from './update-campaign.service.js'
import { SourceModule } from '../source/source.module.js'
import { UpdateStreamService } from './stream/update-stream.service.js'
import { CreateStreamOfferService } from './stream-offer/create-stream-offer.service.js'
import { CreateStreamService } from './stream/create-stream.service.js'
import { CommonStreamService } from './stream/common-stream.service.js'
import { StreamRepository } from './stream/stream.repository.js'
import { UpdateStreamOfferService } from './stream-offer/update-stream-offer.service.js'
import { StreamOfferRepository } from './stream-offer/stream-offer.repository.js'
import { CommonStreamOfferService } from './stream-offer/common-stream-offer.service.js'
import { OfferRepository } from '../offer/offer.repository.js'

@Module({
  controllers: [CampaignController],
  imports: [SourceModule],
  providers: [
    CommonCampaignService,
    CampaignRepository,
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
    OfferRepository,
  ],
  exports: [CampaignRepository],
})
export class CampaignModule {}
