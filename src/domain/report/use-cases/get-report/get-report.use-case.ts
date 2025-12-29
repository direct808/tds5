import { Injectable } from '@nestjs/common'
import { conversionTypes } from '@/domain/conversion/types'
import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'
import {
  IdentifierMap,
  ReportRepository,
} from '@/infra/repositories/report.repository'
import { groups } from '@/domain/report/groups'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely } from 'kysely'
import { DB } from '@generated/kysely'
import { Direction, ReportResponse } from '@/domain/report/types'
import { CheckArgsService } from '@/domain/report/use-cases/get-report/check-args.service'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'
import { FilterProcessorService } from '@/domain/report/use-cases/get-report/filter-processor.service'
import { UserRepository } from '@/infra/repositories/user.repository'
import { UserModel } from '@generated/prisma/models/User'
import { MetricProcessService } from '@/domain/report/use-cases/get-report/metric-process.service'
import { PrismaService } from '@/infra/prisma/prisma.service'

@Injectable()
export class GetReportUseCase {
  constructor(
    @InjectKysely() private readonly db: Kysely<DB>,
    private readonly reportRepository: ReportRepository,
    private readonly checkArgsService: CheckArgsService,
    private readonly filterProcessorService: FilterProcessorService,
    private readonly metricProcessorService: MetricProcessService,
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  public async handle(
    args: GetReportDto,
    userEmail: string,
  ): Promise<ReportResponse> {
    this.checkArgsService.checkArgs(args)

    const { usedIdentifiers, identifierMap } = this.getIdentifierMapProxy()

    const { timeZone } = await this.getUserByEmail(userEmail)

    this.reportRepository.addConversionsIdentifiers(
      identifierMap,
      Object.keys(conversionTypes),
    )

    const qb = new PostgresRawReportQueryBuilder(
      this.prisma,
      timeZone,
      Object.keys(conversionTypes),
    )

    this.filterProcessorService.process(qb, identifierMap, args.filter)
    this.metricProcessorService.process(qb, identifierMap, args.metrics)

    // qb.includeConversionFields(usedIdentifiers)

    this.processGroups(args.groups, qb)

    const { total, summary } = await qb.executeSummary()

    this.processOrder(qb, args.sortField, args.sortOrder)
    qb.setPagination(args.offset, args.limit)

    const rows = total > 0 ? await qb.execute() : []
    // const rows = await qb.execute()

    return { rows, summary, total }
  }

  private processOrder(
    qb: PostgresRawReportQueryBuilder,
    sortField?: string,
    sortOrder: Direction = Direction.asc,
  ): void {
    if (!sortField) {
      return
    }

    qb.orderBy(sortField, sortOrder)
  }

  private processGroups(
    groupKeys: string[],
    qb: PostgresRawReportQueryBuilder,
  ): void {
    for (const groupKey of groupKeys) {
      if (!groups[groupKey]) {
        throw new Error('Unknown group key ' + groupKey)
      }

      const { sql: query, table } = groups[groupKey]

      if (query) {
        qb.selectGroupRaw(query, groupKey, table)
        continue
      }

      qb.selectGroup(groupKey, groupKey)
    }
  }

  private getIdentifierMapProxy(): {
    identifierMap: IdentifierMap
    usedIdentifiers: string[]
  } {
    const usedIdentifiers: string[] = []
    const identifierMap = new Proxy(this.reportRepository.getIdentifierMap(), {
      get(target, key: string): string | undefined {
        usedIdentifiers.push(key)

        return target[key]
      },
    })

    return { identifierMap, usedIdentifiers }
  }

  private async getUserByEmail(email: string): Promise<UserModel> {
    const user = await this.userRepository.getByEmail(email)

    if (!user) {
      throw new Error(`User not found ${email}`)
    }

    return user
  }
}
