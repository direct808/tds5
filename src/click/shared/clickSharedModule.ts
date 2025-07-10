import { Module } from '@nestjs/common'
import { ClickContextService } from '@/click/shared/click-context.service'

@Module({
  providers: [ClickContextService],
  exports: [ClickContextService],
})
export class ClickSharedModule {}
