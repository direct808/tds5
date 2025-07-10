import { Controller, Get, Param, Req, Res } from '@nestjs/common'
import { ClickService } from './click.service'
import { Request, Response } from 'express'
import { SkipAuth } from '@/auth/types'
import { ClickData } from './click-data'
import { ExpressRequestAdapter } from '@/utils/request-adapter'
import { ClickContextService } from '@/click/click-context.service'

@Controller()
export class ClickController {
  constructor(
    private readonly clickService: ClickService,
    private readonly clickContext: ClickContextService,
  ) {}

  @Get(':code([a-zA-Z0-9]{6})')
  @SkipAuth()
  async addClick(
    @Param('code') code: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    this.clickContext.setRequestAdapter(new ExpressRequestAdapter(request))
    await this.clickService.handleClick(
      code,
      //   {
      //   code,
      //   // request: new ExpressRequestAdapter(request),
      //   response,
      //   redirectCount: 0,
      //   clickData: new ClickData(),
      // }
    )
  }
}
