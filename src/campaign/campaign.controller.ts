import { Body, Controller, Post } from '@nestjs/common'
import { CampaignCreateDto } from './dto/campaign-create.dto'
import { CampaignService } from './campaign.service'
import { UserId } from '../auth/user-id.decorator'

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  createCampaign(@Body() args: CampaignCreateDto, @UserId() userId: string) {
    return this.campaignService.create({ ...args, userId }, null)
  }
}
