import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { UserId } from '@/auth/user-id.decorator.js'
import { CreateCampaignService } from './create-campaign.service.js'
import { UpdateCampaignService } from './update-campaign.service.js'
import { CreateCampaignDto } from './dto/create-campaign.dto.js'
import { UpdateCampaignDto } from './dto/update-campaign.dto.js'
import { GLOBAL_PREFIX } from '@/utils/constants.js'

@Controller(GLOBAL_PREFIX + 'campaign')
export class CampaignController {
  constructor(
    private readonly createCampaignService: CreateCampaignService,
    private readonly updateCampaignService: UpdateCampaignService,
  ) {}

  @Post()
  createCampaign(@Body() args: CreateCampaignDto, @UserId() userId: string) {
    return this.createCampaignService.create({ ...args, userId }, null)
  }

  @Put(':id')
  async updateCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    await this.updateCampaignService.update({ ...dto, id, userId }, null)
  }
}
