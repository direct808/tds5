import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateStreamService } from './stream/update-stream.service'
import { CommonCampaignService } from './common-campaign.service'
import { UpdateCampaignDto } from './dto/update-campaign.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  CampaignUpdatedEvent,
  campaignUpdateEventName,
} from '@/domain/campaign/events/campaign-updated.event'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { checkUniqueNameForUpdate } from '@/infra/repositories/utils/repository-utils'
import { CampaignModel } from '../../../generated/prisma/models/Campaign'
import { TransactionFactory } from '@/infra/database/transaction-factory'
import { Transaction } from '@/infra/prisma/prisma-transaction'

@Injectable()
export class UpdateCampaignService {
  constructor(
    private readonly repository: CampaignRepository,
    private readonly updateStreamService: UpdateStreamService,
    private readonly commonCampaignService: CommonCampaignService,
    private readonly eventEmitter: EventEmitter2,
    private readonly trx: TransactionFactory,
  ) {}

  public async update(
    args: UpdateCampaignDto & { userId: string; id: string },
    trx: Transaction | null,
  ): Promise<void> {
    if (!trx) {
      return this.trx.create((trx) => {
        return this.update(args, trx)
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

    await this.repository.update(trx, args.id, this.buildUpdateData(args))

    await this.updateStreamService.updateStreams(
      trx,
      args.id,
      args.userId,
      args.streams,
    )

    this.eventEmitter.emit(
      campaignUpdateEventName,
      new CampaignUpdatedEvent(campaign.code),
    )
  }

  private buildUpdateData(args: UpdateCampaignDto): Partial<CampaignModel> {
    return {
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
    }
  }

  private async getCampaign(
    id: string,
    userId: string,
  ): Promise<CampaignModel> {
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
