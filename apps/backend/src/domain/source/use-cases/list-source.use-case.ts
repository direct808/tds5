import { Injectable } from '@nestjs/common'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { ListSourceDto } from '@/domain/source/dto/list-source.dto'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@Injectable()
export class ListSourceUseCase {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly entityReportUseCase: EntityReportUseCase,
  ) {}

  public async execute(
    args: ListSourceDto,
    userId: string,
  ): Promise<ReportResponseDto> {
    const entities = await this.sourceRepository.list(userId)

    return this.entityReportUseCase.execute(args, entities, 'sourceId')
  }
}
