import { Controller, Get, Req } from '@nestjs/common'
import * as process from 'node:process'
import { SkipAuth } from '@/domain/auth/types'
import { ConversionService } from '@/domain/conversion/conversion.service'
import { Request } from 'express'
import { ExpressRequestAdapter } from '@/shared/request-adapter'

@Controller(process.env.POSTBACK_KEY!)
export class ConversionController {
  constructor(private readonly conversionService: ConversionService) {}

  @Get('postback')
  @SkipAuth()
  conversion(
    // @Res() response: Response,
    @Req() req: Request,
  ): Promise<void> {
    // response.send('Success')

    const requestAdapter = new ExpressRequestAdapter(req)

    return this.conversionService.handle(requestAdapter)
  }
}
