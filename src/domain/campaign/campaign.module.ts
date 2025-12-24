import { Module } from '@nestjs/common'
import { CampaignController } from './campaign.controller'
import { CommonCampaignService } from './common-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'
import { UpdateStreamService } from './stream/update-stream.service'
import { CreateStreamOfferService } from './stream-offer/create-stream-offer.service'
import { CreateStreamService } from './stream/create-stream.service'
import { StreamService } from './stream/stream.service'
import { StreamRepository } from './stream/stream.repository'
import { UpdateStreamOfferService } from './stream-offer/update-stream-offer.service'
import { CommonStreamOfferService } from './stream-offer/common-stream-offer.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { CreateCampaignUseCase } from '@/domain/campaign/use-cases/create-campaign.use-case'

@Module({
  controllers: [CampaignController],
  imports: [RepositoryModule],
  providers: [
    CommonCampaignService,
    CreateCampaignUseCase,
    UpdateCampaignService,
    UpdateStreamService,
    CreateStreamOfferService,
    CreateStreamService,
    StreamService,
    StreamRepository,
    UpdateStreamOfferService,
    CommonStreamOfferService,
  ],
})
export class CampaignModule {}
