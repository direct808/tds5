import { BadRequestException, Injectable } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'

type AddDomainArgs = {
  name: string
  indexPageCampaignId?: string
  intercept404?: boolean
}

@Injectable()
export class CreateDomainUseCase {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async handle(data: AddDomainArgs, userId: string): Promise<void> {
    await this.checkIndexPageCampaignIdExists(data.indexPageCampaignId, userId)
    await this.domainRepository.create({ ...data, userId })
  }

  private async checkIndexPageCampaignIdExists(
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
}
