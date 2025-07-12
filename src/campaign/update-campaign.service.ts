import { Injectable } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { checkUniqueNameForUpdate } from '@/utils/repository-utils.js'
import { CampaignRepository } from './campaign.repository.js'
import { UpdateStreamService } from './stream/update-stream.service.js'
import { CommonCampaignService } from './common-campaign.service.js'
import { UpdateCampaignDto } from './dto/update-campaign.dto.js'
import { Campaign } from './entity/campaign.entity.js'

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
