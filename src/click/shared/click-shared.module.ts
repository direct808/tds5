import { Module } from '@nestjs/common'
import { ClickContext } from '@/click/shared/click-context.service'
import { ClickRepository } from './click.repository'

@Module({
  providers: [ClickContext, ClickRepository],
  exports: [ClickContext, ClickRepository],
})
export class ClickSharedModule {}
