import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger'
import { UserId } from '@/domain/auth/user-id.decorator'
import { CreateCampaignUseCase } from './use-cases/create-campaign.use-case'
import { UpdateCampaignUseCase } from './use-cases/update-campaign.use-case'
import { GetCampaignColumnsUseCase } from './use-cases/get-campaign-columns.use-case'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { UpdateCampaignDto } from './dto/update-campaign.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { ListCampaignDto } from './dto/list-campaign.dto'
import { ListCampaignUseCase } from './use-cases/list-campaign.use-case'
import { DeleteCampaignDto } from '@/domain/campaign/dto/delete-campaign.dto'
import { DeleteCampaignUseCase } from '@/domain/campaign/use-cases/delete-campaign.use-case'
import { GetCampaignByIdUseCase } from '@/domain/campaign/use-cases/get-campaign-by-id.use-case'
import { GetCampaignByIdResponseDto } from '@/domain/campaign/dto/get-campaign-by-id-response.dto'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@Controller(GLOBAL_PREFIX + 'campaign')
export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly updateCampaignUseCase: UpdateCampaignUseCase,
    private readonly listCampaignUseCase: ListCampaignUseCase,
    private readonly deleteCampaignUseCase: DeleteCampaignUseCase,
    private readonly getCampaignColumnsUseCase: GetCampaignColumnsUseCase,
    private readonly getCampaignByIdUseCase: GetCampaignByIdUseCase,
  ) {}

  @Post()
  createCampaign(
    @Body() args: CreateCampaignDto,
    @UserId() userId: string,
  ): Promise<void> {
    return this.createCampaignUseCase.execute({ ...args, userId }, null)
  }

  @Put(':id')
  async updateCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateCampaignDto,
  ): Promise<void> {
    await this.updateCampaignUseCase.execute({ ...dto, id, userId }, null)
  }

  @Get()
  @ApiOkResponse({ type: ReportResponseDto })
  listCampaign(
    @Query() args: ListCampaignDto,
    @UserId() userId: string,
  ): Promise<ReportResponseDto> {
    return this.listCampaignUseCase.execute(args, userId)
  }

  @Delete()
  async deleteCampaign(
    @Body() { ids }: DeleteCampaignDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.deleteCampaignUseCase.execute(ids, userId)
  }

  @Get('columns')
  @ApiResponse({ type: ColumnResponseDto, isArray: true })
  getColumns(): ColumnResponseDto[] {
    return this.getCampaignColumnsUseCase.execute()
  }

  @Get(':id')
  @ApiOkResponse({ type: GetCampaignByIdResponseDto })
  getCampaignById(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<GetCampaignByIdResponseDto> {
    return this.getCampaignByIdUseCase.execute(id, userId)
  }
}
