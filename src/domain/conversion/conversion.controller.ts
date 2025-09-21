import { Controller, Get, Req } from '@nestjs/common'
import * as process from 'node:process'
import { SkipAuth } from '@/domain/auth/types'
import { ConversionService } from '@/domain/conversion/conversion.service'
import { Request } from 'express'
import { ExpressRequestAdapter } from '@/shared/request-adapter'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  PostbackEvent,
  postbackEventName,
} from '@/domain/conversion/events/postback.event'

@Controller(process.env.POSTBACK_KEY!)
export class ConversionController {
  constructor(
    private readonly conversionService: ConversionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('postback')
  @SkipAuth()
  conversion(@Req() req: Request): string {
    const requestAdapter = new ExpressRequestAdapter(req)
    this.eventEmitter.emit(postbackEventName, new PostbackEvent(requestAdapter))

    return 'OK'
  }
}
