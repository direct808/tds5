import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { UserId } from '@/domain/auth/user-id.decorator'
import { CreateCampaignUseCase } from '@/domain/campaign/use-cases/create-campaign.use-case'
import { UpdateCampaignUseCase } from './use-cases/update-campaign.use-case'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { UpdateCampaignDto } from './dto/update-campaign.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ReportResponse } from '@/domain/report/types'
import { ListCampaignDto } from '@/domain/campaign/dto/list-campaign.dto'
import { ListCampaignUseCase } from '@/domain/campaign/use-cases/list-campaign.use-case'

@Controller(GLOBAL_PREFIX + 'campaign')
export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly updateCampaignUseCase: UpdateCampaignUseCase,
    private readonly listCampaignUseCase: ListCampaignUseCase,
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
  listCampaign(
    @Query() args: ListCampaignDto,
    @UserId() userId: string,
  ): Promise<ReportResponse> {
    return this.listCampaignUseCase.execute(args, userId)
  }
}
