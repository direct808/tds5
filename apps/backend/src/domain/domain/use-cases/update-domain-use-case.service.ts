import { Injectable, NotFoundException } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { DomainService } from '../domain.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  DomainUpdatedEvent,
  domainUpdateEventName,
} from '../events/domain-updated.event'
import { DomainModel } from '@generated/prisma/models/Domain'

type UpdateDomainArgs = {
  indexPageCampaignId?: string
  intercept404?: boolean
}

@Injectable()
export class UpdateDomainUseCase {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly domainService: DomainService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(
    id: string,
    data: UpdateDomainArgs,
    userId: string,
  ): Promise<void> {
    const domain = await this.getByIdAndUserIdOrNotFound(id, userId)

    await this.domainService.checkIndexPageCampaignIdExists(
      data.indexPageCampaignId,
      userId,
    )

    await this.domainRepository.update(id, data)

    this.eventEmitter.emit(
      domainUpdateEventName,
      new DomainUpdatedEvent(domain.name),
    )
  }

  public async getByIdAndUserIdOrNotFound(
    id: string,
    userId: string,
  ): Promise<DomainModel> {
    const [domain] = await this.domainRepository.getByIdsAndUserId({
      ids: [id],
      userId,
    })

    if (!domain) {
      throw new NotFoundException()
    }

    return domain
  }
}
