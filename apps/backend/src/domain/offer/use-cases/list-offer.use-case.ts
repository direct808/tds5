import { Injectable } from '@nestjs/common'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { ListOfferDto } from '@/domain/offer/dto/list-offer.dto'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@Injectable()
export class ListOfferUseCase {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListOfferDto,
    userId: string,
  ): Promise<ReportResponseDto> {
    const entities = await this.offerRepository.list(userId)

    return this.entityReportUseCase.execute(args, entities, 'offerId')
  }
}
