import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CommonCampaignService } from './common-campaign.service'
import { CampaignRepository } from './campaign.repository'
import { CreateCampaignService } from './create-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'
import { SourceModule } from '../source/source.module'
import { UpdateStreamService } from './stream/update-stream.service'
import { CreateStreamOfferService } from './stream-offer/create-stream-offer.service'
import { CreateStreamService } from './stream/create-stream.service'
import { CommonStreamService } from './stream/common-stream.service'
import { StreamRepository } from './stream/stream.repository'
import { UpdateStreamOfferService } from './stream-offer/update-stream-offer.service'
import { StreamOfferRepository } from './stream-offer/stream-offer.repository'
import { CommonStreamOfferService } from './stream-offer/common-stream-offer.service'
import { OfferRepository } from '../offer/offer.repository'

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
