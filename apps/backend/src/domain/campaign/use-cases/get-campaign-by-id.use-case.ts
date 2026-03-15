import { Injectable, NotFoundException } from '@nestjs/common'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { GetCampaignByIdResponseDto } from '@/domain/campaign/dto/get-campaign-by-id-response.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class GetCampaignByIdUseCase {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  /** Retrieves a single campaign by id for the given user. */
  public async execute(
    id: string,
    userId: string,
  ): Promise<GetCampaignByIdResponseDto> {
    const [entity] = await this.campaignRepository.getByIdsAndUserId({
      ids: [id],
      userId,
    })

    if (!entity) {
      throw new NotFoundException(`Campaign not found ${id}`)
    }

    return plainToInstance(GetCampaignByIdResponseDto, entity)
  }
}
