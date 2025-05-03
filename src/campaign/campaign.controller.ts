import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { CreateCampaignDto, UpdateCampaignDto } from './dto/'
import { UserId } from '../auth/user-id.decorator'
import { CreateCampaignService } from './create-campaign.service'
import { UpdateCampaignService } from './update-campaign.service'

@Controller('campaign')
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
