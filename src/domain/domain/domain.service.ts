import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { DomainRepository } from '@/infra/repositories/domain.repository'

@Injectable()
export class DomainService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly domainRepository: DomainRepository,
  ) {}

  public async checkIndexPageCampaignIdExists(
    indexPageCampaignId: string | undefined,
    userId: string,
  ): Promise<void> {
    if (!indexPageCampaignId) {
      return
    }
    const campaign = await this.campaignRepository.getByIdAndUserId({
      id: indexPageCampaignId,
      userId,
    })
    if (!campaign) {
      throw new BadRequestException('indexPageCampaignId not found')
    }
  }

  public async getByIdAndUserIdOrNotFound(
    id: string,
    userId: string,
  ): Promise<void> {
    const domain = await this.domainRepository.getByIdAndUserId({ id, userId })

    if (!domain) {
      throw new NotFoundException()
    }
  }
}
