import { Module } from '@nestjs/common'
import { ActionModule } from './action/action.module'
import { DirectUrlModule } from './direct-url/direct-url.module'
import { LandingsOfferModule } from './landings-offers/landings-offer.module'
import { SchemaService } from './schema.service'

@Module({
  providers: [SchemaService],
  imports: [ActionModule, DirectUrlModule, LandingsOfferModule],
  exports: [SchemaService],
})
export class SchemaModule {}
