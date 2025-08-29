import { Injectable, NotFoundException } from '@nestjs/common'
import { CampaignRepository } from '@/campaign/campaign.repository'
import { CampaignProvider } from '@/click/campaign-provider/campaign.provider'
import { Campaign } from '@/campaign/entity/campaign.entity'

@Injectable()
export class DBCampaignProvider implements CampaignProvider {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  public async getFullByCode(code: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      throw new NotFoundException('No campaign')
    }

    return campaign
  }
}
