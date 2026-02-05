import { Injectable } from '@nestjs/common'
import { ReportResponse } from '@/domain/report/types'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { ListSourceDto } from '@/domain/source/dto/list-source.dto'

@Injectable()
export class ListSourceUseCase {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListSourceDto,
    userId: string,
  ): Promise<ReportResponse> {
    const entities = await this.sourceRepository.list(userId)

    return this.entityReportUseCase.handle(args, entities, 'sourceId')
  }
}
