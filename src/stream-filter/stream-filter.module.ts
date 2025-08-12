import { Module } from '@nestjs/common'
import { StreamFilterService } from '@/stream-filter/stream-filter.service'
import { StreamFilterFactory } from '@/stream-filter/stream-filter-factory'
import { ClickSharedModule } from '@/click/shared/click-shared.module'

@Module({
  providers: [StreamFilterService, StreamFilterFactory],
  exports: [StreamFilterService],
  imports: [ClickSharedModule],
})
export class StreamFilterModule {}
