import { Module } from '@nestjs/common'
import { ActionModule } from '@/domain/click/schema/action/action.module'
import { DirectUrlModule } from '@/domain/click/schema/direct-url/direct-url.module'
import { LandingsOfferModule } from '@/domain/click/schema/landings-offers/landings-offer.module'
import { SchemaService } from '@/domain/click/schema/schema.service'

@Module({
  providers: [SchemaService],
  imports: [ActionModule, DirectUrlModule, LandingsOfferModule],
  exports: [SchemaService],
})
export class SchemaModule {}
