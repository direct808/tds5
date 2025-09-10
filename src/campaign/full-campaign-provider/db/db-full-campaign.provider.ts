import { Injectable, NotFoundException } from '@nestjs/common'
import { CampaignRepository } from '@/campaign/campaign.repository'
import { Campaign } from '@/campaign/entity/campaign.entity'
import { FullCampaignProvider } from '@/campaign/full-campaign-provider/types'

@Injectable()
export class DbFullCampaignProvider implements FullCampaignProvider {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  public async getFullByCode(code: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      throw new NotFoundException('No campaign')
    }

    return campaign
  }
}
