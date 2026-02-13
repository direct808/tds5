import { Injectable } from '@nestjs/common'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'

@Injectable()
export class DeleteCampaignUseCase {
  constructor(private readonly repository: CampaignRepository) {}

  public async execute(ids: string[], userId: string): Promise<void> {
    await ensureEntityExists(this.repository, { ids, userId })

    await this.repository.softDeleteMany(ids)
  }
}
