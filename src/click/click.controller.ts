import { Controller, Get, Param, Req, Res } from '@nestjs/common'
import { ClickService } from './click.service'
import { Request, Response } from 'express'
import { SkipAuth } from '@/auth/types'
import { ClickData } from './click-data'
import { ExpressRequestAdapter } from '@/utils/request-adapter'

@Controller()
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @Get(':code([a-zA-Z0-9]{6})')
  @SkipAuth()
  async addClick(
    @Param('code') code: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.clickService.handleClick({
      code,
      request: new ExpressRequestAdapter(request),
      response,
      redirectCount: 0,
      clickData: new ClickData(),
    })
  }
}
