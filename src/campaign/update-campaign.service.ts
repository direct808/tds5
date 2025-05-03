import { Injectable } from '@nestjs/common'
import { UpdateCampaignDto } from './dto'
import { DataSource, EntityManager } from 'typeorm'
import { checkUniqueNameForUpdate } from '../utils'
import { Campaign } from './entity'
import { CampaignRepository } from './campaign.repository'
import { UpdateStreamService } from './stream'
import { CommonCampaignService } from './common-campaign.service'

@Injectable()
export class UpdateCampaignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly repository: CampaignRepository,
    private readonly updateStreamService: UpdateStreamService,
    private readonly commonCampaignService: CommonCampaignService,
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
  }

  private buildUpdateData(args: UpdateCampaignDto): Partial<Campaign> {
    return {
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
    }
  }
}
