import { Injectable } from '@nestjs/common'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { AffiliateNetworkRepository } from '@/infra/repositories/affiliate-network.repository'
import { ListAffiliateNetworkDto } from '@/domain/affiliate-network/dto/list-affiliate-network.dto'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@Injectable()
export class ListAffiliateNetworkUseCase {
  constructor(
    private readonly afRepository: AffiliateNetworkRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListAffiliateNetworkDto,
    userId: string,
  ): Promise<ReportResponseDto> {
    const entities = await this.afRepository.list(userId)

    return this.entityReportUseCase.execute(
      args,
      entities,
      'affiliateNetworkId',
    )
  }
}
