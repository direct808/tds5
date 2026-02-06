import { Injectable } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { DomainService } from '@/domain/domain/domain.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  DomainUpdatedEvent,
  domainUpdateEventName,
} from '@/domain/domain/events/domain-updated.event'

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
    const domain = await this.domainService.getByIdAndUserIdOrNotFound(
      id,
      userId,
    )

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
}
