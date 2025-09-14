import { Controller, Get, Param, Req, Res } from '@nestjs/common'
import { ClickService } from './click.service'
import { Request, Response } from 'express'
import { SkipAuth } from '@/domain/auth/types'
import { ClickContext } from '@/domain/click/shared/click-context.service'
import { RequestAdapterFactory } from '@/utils/request-adapter/request-adapter-factory'

@Controller()
export class ClickController {
  constructor(
    private readonly clickService: ClickService,
    private readonly clickContext: ClickContext,
    private readonly requestAdapterFactory: RequestAdapterFactory,
  ) {}

  @Get(':code([a-zA-Z0-9]{6})')
  @SkipAuth()
  async addClick(
    @Param('code') code: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const adapter = this.requestAdapterFactory.create(request)
    this.clickContext.setRequestAdapter(adapter)
    this.clickContext.setResponseAdapter(response)
    this.clickContext.createClickData()

    await this.clickService.handleClick(code)
  }
}
