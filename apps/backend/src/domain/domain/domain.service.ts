import { BadRequestException, Injectable } from '@nestjs/common'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class DomainService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  public async checkIndexPageCampaignIdExists(
    indexPageCampaignId: string | undefined,
    userId: string,
  ): Promise<void> {
    if (isNullable(indexPageCampaignId)) {
      return
    }
    const [campaign] = await this.campaignRepository.getByIdsAndUserId({
      ids: [indexPageCampaignId],
      userId,
    })
    if (!campaign) {
      throw new BadRequestException('indexPageCampaignId not found')
    }
  }
}
