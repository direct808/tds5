import { Injectable, NotFoundException } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { checkUniqueNameForUpdate } from '@/utils/repository-utils'
import { CampaignRepository } from './campaign.repository'
import { UpdateStreamService } from './stream/update-stream.service'
import { CommonCampaignService } from './common-campaign.service'
import { UpdateCampaignDto } from './dto/update-campaign.dto'
import { Campaign } from './entity/campaign.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  CampaignUpdatedEvent,
  campaignUpdateEventName,
} from '@/campaign/events/campaign-updated.event'

@Injectable()
export class UpdateCampaignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: CampaignRepository,
    private readonly updateStreamService: UpdateStreamService,
    private readonly commonCampaignService: CommonCampaignService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async update(
    args: UpdateCampaignDto & { userId: string; id: string },
    manager: EntityManager | null,
  ): Promise<void> {
    if (!manager) {
      return this.dataSource.transaction((manage) => {
        return this.update(args, manage)
      })
    }

    const campaign = await this.getCampaign(args.id, args.userId)

    await this.commonCampaignService.ensureSourceExists(
      args.userId,
      args.sourceId,
    )

    if (args.name) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.repository.update(manager, args.id, this.buildUpdateData(args))

    await this.updateStreamService.updateStreams(
      manager,
      args.id,
      args.userId,
      args.streams,
    )

    this.eventEmitter.emit(
      campaignUpdateEventName,
      new CampaignUpdatedEvent(campaign.code),
    )
  }

  private buildUpdateData(args: UpdateCampaignDto): Partial<Campaign> {
    return {
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
    }
  }

  private async getCampaign(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.repository.getByIdAndUserId({
      id,
      userId,
    })

    if (!campaign) {
      throw new NotFoundException('Campaign not found')
    }

    return campaign
  }
}
