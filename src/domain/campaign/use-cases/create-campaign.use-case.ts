import { Injectable } from '@nestjs/common'
import { CreateCampaignDto } from '@/domain/campaign/dto/create-campaign.dto'
import { Transaction } from '@/infra/prisma/prisma-transaction'
import { checkUniqueNameForCreate } from '@/infra/repositories/utils/repository-utils'
import {
  CampaignCreatedEvent,
  campaignCreatedEventName,
} from '@/domain/campaign/events/campaign-created.event'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { CreateStreamService } from '@/domain/campaign/stream/create-stream.service'
import { CampaignService } from '@/domain/campaign/campaign.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { TransactionFactory } from '@/infra/database/transaction-factory'
import { CampaignUncheckedCreateInput } from '@generated/prisma/models/Campaign'
import { nanoid } from 'nanoid'

@Injectable()
export class CreateCampaignUseCase {
  constructor(
    private readonly repository: CampaignRepository,
    private readonly createStreamService: CreateStreamService,
    private readonly commonCampaignService: CampaignService,
    private readonly eventEmitter: EventEmitter2,
    private readonly tr: TransactionFactory,
  ) {}

  public async handle(
    args: CreateCampaignDto & { userId: string },
    tr: Transaction | null,
  ): Promise<void> {
    if (!tr) {
      return this.tr.create((tr) => {
        return this.handle(args, tr)
      })
    }

    await this.commonCampaignService.ensureSourceExists(args)
    await this.commonCampaignService.ensureDomainExists(args)

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
