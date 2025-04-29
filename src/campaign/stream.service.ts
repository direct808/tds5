import { Injectable } from '@nestjs/common'
import { StreamInputDto } from './dto/stream-input.dto'
import { EntityManager } from 'typeorm'
import { StreamRepository } from './stream.repository'
import { CampaignRepository } from './campaign.repository'
import { ensureEntityExists } from '../utils'
import { Stream } from './entity'

@Injectable()
export class StreamService {
  constructor(
    private readonly repository: StreamRepository,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async create(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    streamsInput: StreamInputDto[],
  ) {
    for (const stream of streamsInput) {
      await this.createOne(manager, campaignId, userId, stream)
    }
  }

  private async createOne(
    manager: EntityManager,
    campaignId: string,
    userId: string,
    streamsInput: StreamInputDto,
  ) {
    await this.ensureCampaignExists(userId, streamsInput.actionCampaignId)
    const data = this.buildData(streamsInput, campaignId)
    await this.repository.create(manager, data)
  }

  private async ensureCampaignExists(userId: string, campaignId?: string) {
    if (!campaignId) {
      return
    }
    await ensureEntityExists(
      this.campaignRepository,
      {
        userId,
        id: campaignId,
      },
      'actionCampaignId not found',
    )
  }

  private buildData(
    input: StreamInputDto,
    campaignId: string,
  ): Partial<Stream> {
    return {
      name: input.name,
      campaignId,
      schema: input.schema,
      redirectType: input.redirectType,
      redirectUrl: input.redirectUrl,
      actionType: input.actionType,
      actionCampaignId: input.actionCampaignId,
      actionContent: input.actionContent,
    }
  }
}
