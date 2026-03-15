import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserId } from '@/domain/auth/user-id.decorator'
import { OfferService } from './offer.service'
import { CreateOfferDto } from './dto/create-offer.dto'
import { UpdateOfferDto } from './dto/update-offer.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ListOfferUseCase } from './use-cases/list-offer.use-case'
import { GetOfferColumnsUseCase } from './use-cases/get-offer-columns.use-case'
import { ListOfferDto } from './dto/list-offer.dto'
import { ReportResponse } from '@/domain/report/types'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { DeleteOfferDto } from '@/domain/offer/dto/delete-offer.dto'

@ApiTags('Offers')
@Controller(GLOBAL_PREFIX + 'offer')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly listOfferUseCase: ListOfferUseCase,
    private readonly getOfferColumnsUseCase: GetOfferColumnsUseCase,
  ) {}

  @Get()
  listOffers(
    @Query() args: ListOfferDto,
    @UserId() userId: string,
  ): Promise<ReportResponse> {
    return this.listOfferUseCase.execute(args, userId)
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

  @Get('columns')
  @ApiResponse({ type: ColumnResponseDto, isArray: true })
  getColumns(): ColumnResponseDto[] {
    return this.getOfferColumnsUseCase.execute()
  }
}
