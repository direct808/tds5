import { Module } from '@nestjs/common'
import { StreamFilterService } from '@/stream-filter/stream-filter.service'
import { StreamFilterFactory } from '@/stream-filter/stream-filter-factory'

@Module({
  providers: [StreamFilterService, StreamFilterFactory],
  exports: [StreamFilterService],
})
export class StreamFilterModule {}
