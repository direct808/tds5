import { Module } from '@nestjs/common'
import { ActionModule } from '@/domain/click/schema/action/action.module'
import { DirectUrlModule } from '@/domain/click/schema/direct-url/direct-url.module'
import { LandingsOfferModule } from '@/domain/click/schema/landings-offers/landings-offer.module'

@Module({
  imports: [ActionModule, DirectUrlModule, LandingsOfferModule],
  exports: [ActionModule, DirectUrlModule, LandingsOfferModule],
})
export class SchemaModule {}
