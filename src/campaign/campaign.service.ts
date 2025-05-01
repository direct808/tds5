import { CreateCampaignDto } from './dto/create-campaign.dto'
import { DataSource, EntityManager } from 'typeorm'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '../utils'
import { Injectable } from '@nestjs/common'
import { CampaignRepository } from './campaign.repository'
import { nanoid } from 'nanoid'
import { StreamService } from './stream.service'
import { Campaign } from './entity'
import { SourceRepository } from '../source/source.repository'
import { UpdateCampaignDto } from './dto'

@Injectable()
export class CampaignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: CampaignRepository,
    private readonly sourceRepository: SourceRepository,
    private readonly streamService: StreamService,
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

    await this.ensureSourceExists(args.userId, args.sourceId)

    await checkUniqueNameForCreate(this.repository, args)

    const data = this.buildCreateData(args)

    const campaign = await this.repository.create(manager, data)

    await this.streamService.createStreams(
      manager,
      campaign.id,
      args.userId,
      args.streams,
    )
  }

  public async update(
    args: UpdateCampaignDto & { userId: string; id: string },
    manager: EntityManager | null,
  ): Promise<void> {
    if (!manager) {
      return this.dataSource.transaction((manage) => {
        return this.update(args, manage)
      })
    }

    await this.ensureSourceExists(args.userId, args.sourceId)

    if (args.name) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.repository.update(manager, args.id, this.buildUpdateData(args))

    await this.streamService.updateStreams(
      manager,
      args.id,
      args.userId,
      args.streams,
    )
  }

  private makeCode(): string {
    return nanoid(6)
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

  private buildUpdateData(args: UpdateCampaignDto): Partial<Campaign> {
    return {
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
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
