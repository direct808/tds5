import { Injectable } from '@nestjs/common'
import { CreateCampaignDto } from './dto'
import { DataSource, EntityManager } from 'typeorm'
import { checkUniqueNameForCreate } from '../utils'
import { CampaignRepository } from './campaign.repository'
import { CreateStreamService } from './stream'
import { CommonCampaignService } from './common-campaign.service'
import { Campaign } from './entity'
import { nanoid } from 'nanoid'

@Injectable()
export class CreateCampaignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: CampaignRepository,
    private readonly createStreamService: CreateStreamService,
    private readonly commonCampaignService: CommonCampaignService,
  ) {}

  public async create(
    args: CreateCampaignDto & { userId: string },
    manager: EntityManager | null,
  ): Promise<void> {
    if (!manager) {
      return this.dataSource.transaction((manage) => {
        return this.create(args, manage)
      })
    }

    await this.commonCampaignService.ensureSourceExists(
      args.userId,
      args.sourceId,
    )

    await checkUniqueNameForCreate(this.repository, args)

    const data = this.buildCreateData(args)

    const campaign = await this.repository.create(manager, data)

    await this.createStreamService.createStreams(
      manager,
      campaign.id,
      args.userId,
      args.streams,
    )
  }

  private buildCreateData(
    args: CreateCampaignDto & { userId: string },
  ): Partial<Campaign> {
    return {
      name: args.name,
      code: this.makeCode(),
      sourceId: args.sourceId,
      active: args.active,
      userId: args.userId,
    }
  }

  private makeCode(): string {
    return nanoid(6)
  }
}
