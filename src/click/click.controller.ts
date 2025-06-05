import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common'
import { ClickService } from './click.service'
import { Request, Response } from 'express'
import { SkipAuth } from '../auth/types'
import { ClickData } from './click-data'

@Controller()
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @Get(':code([a-zA-Z0-9]{6})')
  @SkipAuth()
  async addClick(
    @Param('code') code: string,
    @Query() query: Record<string, string>,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.clickService.handleClick({
      code,
      request,
      response,
      query,
      redirectCount: 0,
      clickData: new ClickData(),
    })
  }
}
