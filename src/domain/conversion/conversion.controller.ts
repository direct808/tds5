import { Controller, Get, Req } from '@nestjs/common'
import { SkipAuth } from '@/domain/auth/types'
import { Request } from 'express'
import { ExpressRequestAdapter } from '@/shared/request-adapter'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  PostbackEvent,
  postbackEventName,
} from '@/domain/conversion/events/postback.event'
import { postbackKey } from '@/infra/config/app-config.service'

@Controller(postbackKey())
export class ConversionController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Get('postback')
  @SkipAuth()
  conversion(@Req() req: Request): string {
    const requestAdapter = new ExpressRequestAdapter(req)
    this.eventEmitter.emit(postbackEventName, new PostbackEvent(requestAdapter))

    return 'OK'
  }
}
