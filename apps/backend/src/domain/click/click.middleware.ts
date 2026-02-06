import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { ClickService } from './click.service'
import { ClickContext } from './shared/click-context.service'
import { RequestAdapterFactory } from '../../shared/request-adapter/request-adapter-factory'

@Injectable()
export class ClickMiddleware implements NestMiddleware {
  constructor(
    private readonly clickService: ClickService,
    private readonly clickContext: ClickContext,
    private readonly requestAdapterFactory: RequestAdapterFactory,
  ) {}

  use(request: Request, response: Response): Promise<void> {
    const adapter = this.requestAdapterFactory.create(request)
    this.clickContext.setRequestAdapter(adapter)
    this.clickContext.setResponseAdapter(response)
    this.clickContext.createClickData()

    return this.clickService.handleClick(request.params.code, adapter.domain())
  }
}
