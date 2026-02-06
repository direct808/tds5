import { Injectable } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { DomainService } from '@/domain/domain/domain.service'

type AddDomainArgs = {
  name: string
  indexPageCampaignId?: string
  intercept404?: boolean
}

@Injectable()
export class CreateDomainUseCase {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly domainService: DomainService,
  ) {}

  public async execute(data: AddDomainArgs, userId: string): Promise<void> {
    await this.domainService.checkIndexPageCampaignIdExists(
      data.indexPageCampaignId,
      userId,
    )
    await this.domainRepository.create({ ...data, userId })
  }
}
