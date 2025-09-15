import { Module } from '@nestjs/common'
import { ActionModule } from '@/domain/click/stream/schema/action/action.module'
import { DirectUrlModule } from '@/domain/click/stream/schema/direct-url/direct-url.module'
import { LandingsOfferModule } from '@/domain/click/stream/schema/landings-offers/landings-offer.module'
import { SchemaService } from '@/domain/click/stream/schema/schema.service'

@Module({
  providers: [SchemaService],
  imports: [ActionModule, DirectUrlModule, LandingsOfferModule],
  exports: [SchemaService],
})
export class SchemaModule {}
