import { forwardRef, Module } from '@nestjs/common'
import { StreamRepository } from './stream.repository'
import { CommonStreamService } from './common-stream.service'
import { UpdateStreamService } from './update-stream.service'
import { StreamOfferModule } from '../stream-offer'
import { CampaignModule } from '../campaign.module'
import { CreateStreamService } from './create-stream.service'

@Module({
  providers: [
    StreamRepository,
    CommonStreamService,
    UpdateStreamService,
    CreateStreamService,
  ],
  imports: [StreamOfferModule, forwardRef(() => CampaignModule)],
  exports: [CreateStreamService, UpdateStreamService],
})
export class StreamModule {}
