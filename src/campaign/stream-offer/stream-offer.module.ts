import { Module } from '@nestjs/common'
import { CreateStreamOfferService } from './create-stream-offer.service'
import { UpdateStreamOfferService } from './update-stream-offer.service'
import { StreamOfferRepository } from './stream-offer.repository'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { OfferModule } from '../../offer'

@Module({
  imports: [OfferModule],
  providers: [
    CreateStreamOfferService,
    UpdateStreamOfferService,
    StreamOfferRepository,
    CommonStreamOfferService,
  ],
  exports: [CreateStreamOfferService, UpdateStreamOfferService],
})
export class StreamOfferModule {}
