import { CampaignCreateDto } from './dto/campaign-create.dto'
import { DataSource, EntityManager } from 'typeorm'
import { checkUniqueNameForCreate, ensureEntityExists } from '../utils'
import { Injectable } from '@nestjs/common'
import { CampaignRepository } from './campaign.repository'
import { nanoid } from 'nanoid'
import { StreamService } from './stream.service'
import { Campaign } from './entity'
import { SourceRepository } from '../source/source.repository'

@Injectable()
export class CampaignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: CampaignRepository,
    private readonly sourceRepository: SourceRepository,
    private readonly streamService: StreamService,
  ) {}

  public async create(
    args: CampaignCreateDto & { userId: string },
    manager: EntityManager | null,
  ): Promise<void> {
    if (!manager) {
      return this.dataSource.transaction((manage) => {
        return this.create(args, manage)
      })
    }

    await this.ensureSourceExists(args.userId, args.sourceId)

    await checkUniqueNameForCreate(this.repository, args)

    const data = this.buildData(args)

    const campaign = await this.repository.create(manager, data)

    await this.streamService.create(
      manager,
      campaign.id,
      args.userId,
      args.streams,
    )
  }

  private makeCode(): string {
    return nanoid(6)
  }

  private buildData(
    args: CampaignCreateDto & { userId: string },
  ): Partial<Campaign> {
    return {
      name: args.name,
      code: this.makeCode(),
      sourceId: args.sourceId,
      active: args.active,
      userId: args.userId,
    }
  }

  private async ensureSourceExists(
    userId: string,
    sourceId?: string,
  ): Promise<void> {
    if (!sourceId) {
      return
    }
    await ensureEntityExists(
      this.sourceRepository,
      {
        userId,
        id: sourceId,
      },
      'Source not found',
    )
  }
}
