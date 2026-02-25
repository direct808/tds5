import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { UserId } from '../auth/user-id.decorator'
import { OfferService } from './offer.service'
import { CreateOfferDto } from './dto/create-offer.dto'
import { UpdateOfferDto } from './dto/update-offer.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ListOfferUseCase } from './use-cases/list-offer.use-case'
import { ListOfferDto } from './dto/list-offer.dto'
import { ListOfferResponseDto } from '@/domain/offer/dto/list-offer-response.dto'
import { DeleteOfferDto } from '@/domain/offer/dto/delete-offer.dto'
import { GetByIdUseCase } from '@/domain/offer/use-cases/get-by-id.use-case'
import { GetByIdResponseDto } from '@/domain/offer/dto/get-by-id-response.dto'

@ApiTags('Offers')
@Controller(GLOBAL_PREFIX + 'offer')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly listOfferUseCase: ListOfferUseCase,
    private readonly getByIdUseCase: GetByIdUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ListOfferResponseDto })
  listOffers(
    @Query() args: ListOfferDto,
    @UserId() userId: string,
  ): Promise<ListOfferResponseDto> {
    return this.listOfferUseCase.execute(args, userId)
  }

  @Get(':id')
  @ApiOkResponse({ type: GetByIdResponseDto })
  offerGetById(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<GetByIdResponseDto> {
    return this.getByIdUseCase.execute(id, userId)
  }

  @Post()
  async createOffer(
    @Body() args: CreateOfferDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.offerService.create({ ...args, userId })
  }

  @Patch(':id')
  async updateOffer(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateOfferDto,
  ): Promise<void> {
    await this.offerService.update({ ...dto, id, userId })
  }

  @Delete()
  async deleteOffers(
    @Body() { ids }: DeleteOfferDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.offerService.softDeleteMany({ ids, userId })
  }
}
