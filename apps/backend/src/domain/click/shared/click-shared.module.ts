import { Module } from '@nestjs/common'
import { ClickContext } from './click-context.service'

@Module({
  providers: [ClickContext],
  exports: [ClickContext],
})
export class ClickSharedModule {}
