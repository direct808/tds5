import { Injectable } from '@nestjs/common'
import { CreateStreamDto } from '../dto/create-stream.dto'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'
import { StreamUncheckedCreateInput } from '../../../../generated/prisma/models/Stream'

@Injectable()
export class CommonStreamService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  public async ensureCampaignExists(
    userId: string,
    campaignId?: string,
  ): Promise<void> {
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
  ): StreamUncheckedCreateInput {
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
