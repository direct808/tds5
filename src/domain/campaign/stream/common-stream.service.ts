import { Injectable } from '@nestjs/common'
import { CreateStreamDto } from '../dto/create-stream.dto'
import { Stream } from '../entity/stream.entity'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'

@Injectable()
export class CommonStreamService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  public async ensureCampaignExists(userId: string, campaignId?: string) {
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

  public buildData(
    input: CreateStreamDto,
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
