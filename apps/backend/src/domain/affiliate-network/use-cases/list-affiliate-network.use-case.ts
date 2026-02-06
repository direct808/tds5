import { Injectable } from '@nestjs/common'
import { ReportResponse } from '../../report/types'
import { EntityReportUseCase } from '../../report/use-cases/entity-report-use-case.service'
import { AffiliateNetworkRepository } from '../../../infra/repositories/affiliate-network.repository'
import { ListAffiliateNetworkDto } from '../dto/list-affiliate-network.dto'

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

    return this.entityReportUseCase.execute(
      args,
      entities,
      'affiliateNetworkId',
    )
  }
}
