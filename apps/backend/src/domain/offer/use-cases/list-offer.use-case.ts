import { Injectable } from '@nestjs/common'
import { ReportResponse } from '../../report/types'
import { EntityReportUseCase } from '../../report/use-cases/entity-report-use-case.service'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { ListOfferDto } from '../dto/list-offer.dto'

@Injectable()
export class ListOfferUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListOfferDto,
    userId: string,
  ): Promise<ReportResponse> {
    const entities = await this.offerRepository.list(userId)

    return this.entityReportUseCase.execute(args, entities, 'offerId')
  }
}
