import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  PostbackEvent,
  postbackEventName,
} from '@/domain/conversion/events/postback.event'
import { ConversionRegisterUseCase } from '@/domain/conversion/use-cases/conversion-register.use-case'

@Injectable()
export class ConversionListener {
  constructor(
    private readonly conversionRegisterUseCase: ConversionRegisterUseCase,
  ) {}

  @OnEvent(postbackEventName)
  handlePostbackEvent({ requestAdapter }: PostbackEvent): Promise<void> {
    return this.conversionRegisterUseCase.execute(requestAdapter)
  }
}
