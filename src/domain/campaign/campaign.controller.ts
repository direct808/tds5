import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { UserId } from '@/domain/auth/user-id.decorator'
import { CreateCampaignUseCase } from '@/domain/campaign/use-cases/create-campaign.use-case'
import { UpdateCampaignUseCase } from './use-cases/update-campaign.use-case'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { UpdateCampaignDto } from './dto/update-campaign.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'

@Controller(GLOBAL_PREFIX + 'campaign')
export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly updateCampaignService: UpdateCampaignUseCase,
  ) {}

  @Post()
  createCampaign(
    @Body() args: CreateCampaignDto,
    @UserId() userId: string,
  ): Promise<void> {
    return this.createCampaignUseCase.handle({ ...args, userId }, null)
  }

  @Put(':id')
  async updateCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateCampaignDto,
  ): Promise<void> {
    await this.updateCampaignService.handle({ ...dto, id, userId }, null)
  }
}
