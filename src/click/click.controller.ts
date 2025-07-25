import { Controller, Get, Param, Req, Res } from '@nestjs/common'
import { ClickService } from './click.service'
import { Request, Response } from 'express'
import { SkipAuth } from '@/auth/types'
import { ExpressRequestAdapter } from '@/utils/request-adapter'
import { ClickContext } from '@/click/shared/click-context.service'

@Controller()
export class ClickController {
  constructor(
    private readonly clickService: ClickService,
    private readonly clickContext: ClickContext,
  ) {}

  @Get(':code([a-zA-Z0-9]{6})')
  @SkipAuth()
  async addClick(
    @Param('code') code: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    this.clickContext.setRequestAdapter(new ExpressRequestAdapter(request))
    this.clickContext.setResponseAdapter(response)
    this.clickContext.createClickData()

    await this.clickService.handleClick(code)
  }
}
