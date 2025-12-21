import { Injectable } from '@nestjs/common'
import { CommonCampaignService } from './common-campaign.service'
import { nanoid } from 'nanoid'
import { CreateStreamService } from './stream/create-stream.service'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  CampaignCreatedEvent,
  campaignCreatedEventName,
} from './events/campaign-created.event'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { checkUniqueNameForCreate } from '@/infra/repositories/utils/repository-utils'
import { TransactionFactory } from '@/infra/database/transaction-factory'
import { Transaction } from '@/infra/prisma/prisma-transaction'
import { CampaignUncheckedCreateInput } from '@generated/prisma/models/Campaign'

@Injectable()
export class CreateCampaignService {
  constructor(
    private readonly repository: CampaignRepository,
    private readonly createStreamService: CreateStreamService,
    private readonly commonCampaignService: CommonCampaignService,
    private readonly eventEmitter: EventEmitter2,
    private readonly tr: TransactionFactory,
  ) {}

  public async create(
    args: CreateCampaignDto & { userId: string },
    tr: Transaction | null,
  ): Promise<void> {
    if (!tr) {
      return this.tr.create((tr) => {
        return this.create(args, tr)
      })
    }

    await this.commonCampaignService.ensureSourceExists(
      args.userId,
      args.sourceId,
    )

    await this.commonCampaignService.ensureDomainExists(
      args.userId,
      args.domainId,
    )

    await checkUniqueNameForCreate(this.repository, args)

    const data = this.buildCreateData(args)

    const campaign = await this.repository.create(tr, data)

    await this.createStreamService.createStreams(
      tr,
      campaign.id,
      args.userId,
      args.streams,
    )

    this.eventEmitter.emit(
      campaignCreatedEventName,
      new CampaignCreatedEvent(campaign.code),
    )
  }

  private buildCreateData(
    args: CreateCampaignDto & { userId: string },
  ): CampaignUncheckedCreateInput {
    return {
      name: args.name,
      code: this.makeCode(),
      sourceId: args.sourceId,
      active: args.active,
      domainId: args.domainId,
      userId: args.userId,
    }
  }

  private makeCode(): string {
    return nanoid(6)
  }
}
