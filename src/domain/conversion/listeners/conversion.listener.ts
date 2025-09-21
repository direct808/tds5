import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ConversionService } from '@/domain/conversion/conversion.service'
import {
  PostbackEvent,
  postbackEventName,
} from '@/domain/conversion/events/postback.event'

@Injectable()
export class ConversionListener {
  private readonly logger = new Logger(ConversionListener.name)
  constructor(private readonly conversionService: ConversionService) {}

  @OnEvent(postbackEventName)
  handleCampaignCreatedEvent({ requestAdapter }: PostbackEvent): Promise<void> {
    this.logger.debug('PostbackEvent')

    return this.conversionService.handle(requestAdapter)
  }
}
