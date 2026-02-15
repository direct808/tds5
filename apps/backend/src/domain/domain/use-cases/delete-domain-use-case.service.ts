import { Injectable } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  DomainSoftDeletedEvent,
  domainSoftDeletedEventName,
} from '@/domain/domain/events/domain-soft-deleted.event'

@Injectable()
export class DeleteDomainUseCase {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(ids: string[], userId: string): Promise<void> {
    await ensureEntityExists(this.domainRepository, { ids, userId })
    await this.domainRepository.softDeleteMany(ids)

    this.eventEmitter.emit(
      domainSoftDeletedEventName,
      new DomainSoftDeletedEvent(ids),
    )
  }
}
