import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common'
import { Request } from 'express'
import { ExpressRequestAdapter } from '@/shared/request-adapter'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostbackEvent, postbackEventName } from './events/postback.event'
import { SkipAuth } from '@/domain/auth/decorators/skip-auth.decorator'
import { AppConfig } from '@/infra/config/app-config.service'

@Controller('postback')
export class ConversionController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly config: AppConfig,
  ) {}

  @Get(':postbackKey')
  @SkipAuth()
  conversion(
    @Req() req: Request,
    @Param('postbackKey') postbackKey: string,
  ): string {
    if (postbackKey !== this.config.postbackKey) {
      throw new NotFoundException()
    }
    const requestAdapter = new ExpressRequestAdapter(req)
    this.eventEmitter.emit(postbackEventName, new PostbackEvent(requestAdapter))

    return 'OK'
  }
}
