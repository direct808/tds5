import { Injectable } from '@nestjs/common'
import { ReportResponse } from '@/domain/report/types'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { ListOfferDto } from '@/domain/offer/dto/list-offer.dto'

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

    return this.entityReportUseCase.handle(args, entities, 'offerId')
  }
}
