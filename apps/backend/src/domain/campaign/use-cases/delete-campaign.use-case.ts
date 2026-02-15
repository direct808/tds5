import { Injectable } from '@nestjs/common'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  CampaignSoftDeletedEvent,
  campaignSoftDeletedEventName,
} from '@/domain/campaign/events/campaign-soft-deleted.event'

@Injectable()
export class DeleteCampaignUseCase {
  constructor(
    private readonly repository: CampaignRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(ids: string[], userId: string): Promise<void> {
    await ensureEntityExists(this.repository, { ids, userId })

    await this.repository.softDeleteMany(ids)

    this.eventEmitter.emit(
      campaignSoftDeletedEventName,
      new CampaignSoftDeletedEvent(ids),
    )
  }
}
