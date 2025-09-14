import { Module } from '@nestjs/common'
import { RequestAdapterFactory } from '@/shared/request-adapter/request-adapter-factory'

@Module({
  providers: [RequestAdapterFactory],
  exports: [RequestAdapterFactory],
})
export class RequestAdapterModule {}
