import { Module } from '@nestjs/common'
import { RequestAdapterFactory } from './request-adapter-factory'

@Module({
  providers: [RequestAdapterFactory],
  exports: [RequestAdapterFactory],
})
export class RequestAdapterModule {}
