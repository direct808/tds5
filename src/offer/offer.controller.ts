import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserId } from '@/auth/user-id.decorator.js'
import { OfferService } from './offer.service.js'
import { CreateOfferDto } from './dto/create-offer.dto.js'
import { UpdateOfferDto } from './dto/update-offer.dto.js'
import { GLOBAL_PREFIX } from '@/utils/constants.js'

@ApiTags('Оферы')
@Controller(GLOBAL_PREFIX + 'offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get()
  getOffers(@UserId() userId: string) {
    return this.offerService.getList(userId)
  }

  @Post()
  async createOffer(@Body() args: CreateOfferDto, @UserId() userId: string) {
    await this.offerService.create({ ...args, userId })
  }

  @Patch(':id')
  async updateOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateOfferDto,
  ) {
    await this.offerService.update({ ...dto, id, userId })
  }

  @Delete(':id')
  async deleteOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    await this.offerService.delete({ id, userId })
  }
}
