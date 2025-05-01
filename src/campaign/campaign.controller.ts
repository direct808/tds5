import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { CreateCampaignDto, UpdateCampaignDto } from './dto/'
import { CampaignService } from './campaign.service'
import { UserId } from '../auth/user-id.decorator'

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  createCampaign(@Body() args: CreateCampaignDto, @UserId() userId: string) {
    return this.campaignService.create({ ...args, userId }, null)
  }

  @Patch(':id')
  async updateCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    await this.campaignService.update({ ...dto, id, userId }, null)
  }
}
