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
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserId } from '@/domain/auth/user-id.decorator'
import { OfferService } from './offer.service'
import { CreateOfferDto } from './dto/create-offer.dto'
import { UpdateOfferDto } from './dto/update-offer.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ListOfferUseCase } from './use-cases/list-offer.use-case'
import { GetOfferColumnsUseCase } from './use-cases/get-offer-columns.use-case'
import { ListOfferDto } from './dto/list-offer.dto'
import { DeleteOfferDto } from '@/domain/offer/dto/delete-offer.dto'
import { GetByIdUseCase } from '@/domain/offer/use-cases/get-by-id.use-case'
import { GetByIdResponseDto } from '@/domain/offer/dto/get-by-id-response.dto'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@ApiTags('Offers')
@Controller(GLOBAL_PREFIX + 'offer')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly listOfferUseCase: ListOfferUseCase,
    private readonly getOfferColumnsUseCase: GetOfferColumnsUseCase,
    private readonly getByIdUseCase: GetByIdUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ReportResponseDto })
  listOffers(
    @Query() args: ListOfferDto,
    @UserId() userId: string,
  ): Promise<ReportResponseDto> {
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

  @Get(':id')
  @ApiOkResponse({ type: GetByIdResponseDto })
  offerGetById(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<GetByIdResponseDto> {
    return this.getByIdUseCase.execute(id, userId)
  }
}
