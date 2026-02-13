import { Injectable } from '@nestjs/common'
import { DomainRepository } from '../../../infra/repositories/domain.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { TransactionFactory } from '@/infra/database/transaction-factory'
import { Transaction } from '@/infra/prisma/prisma-transaction'

@Injectable()
export class DeleteDomainUseCase {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly tr: TransactionFactory,
  ) {}

  public async execute(ids: string[], userId: string): Promise<void> {
    await ensureEntityExists(this.domainRepository, { ids, userId })
    await this.domainRepository.softDeleteMany(ids)
    //todo resect campaign cache
  }
}
