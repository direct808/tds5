import { Injectable } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { DomainService } from '@/domain/domain/domain.service'

type UpdateDomainArgs = {
  indexPageCampaignId?: string
  intercept404?: boolean
}

@Injectable()
export class UpdateDomainUseCase {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly domainService: DomainService,
  ) {}

  public async handle(
    id: string,
    data: UpdateDomainArgs,
    userId: string,
  ): Promise<void> {
    await this.domainService.getByIdAndUserIdOrNotFound(id, userId)

    await this.domainService.checkIndexPageCampaignIdExists(
      data.indexPageCampaignId,
      userId,
    )

    await this.domainRepository.update(id, data)
  }
}
