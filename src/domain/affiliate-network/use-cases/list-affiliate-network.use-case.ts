import { Injectable } from '@nestjs/common'
import { ReportResponse } from '@/domain/report/types'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { AffiliateNetworkRepository } from '@/infra/repositories/affiliate-network.repository'
import { ListAffiliateNetworkDto } from '@/domain/affiliate-network/dto/list-affiliate-network.dto'

@Injectable()
export class ListAffiliateNetworkUseCase {
  constructor(
    private readonly afRepository: AffiliateNetworkRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListAffiliateNetworkDto,
    userId: string,
  ): Promise<ReportResponse> {
    const entities = await this.afRepository.list(userId)

    return this.entityReportUseCase.handle(args, entities, 'affiliateNetworkId')
  }
}
