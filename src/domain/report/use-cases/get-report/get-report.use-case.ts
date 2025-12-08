import { Injectable } from '@nestjs/common'
import { conversionTypes } from '@/domain/conversion/types'
import { ReportQueryBuilder } from '@/domain/report/report-query-builder'
import {
  IdentifierMap,
  ReportRepository,
} from '@/infra/repositories/report.repository'
import { groups } from '@/domain/report/groups'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely } from 'kysely'
import { DB } from '@generated/kysely'
import { Direction, InputFilterData } from '@/domain/report/types'
import { CheckArgsService } from '@/domain/report/use-cases/get-report/check-args.service'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'
import { FilterProcessorService } from '@/domain/report/use-cases/get-report/filter-processor.service'
import { UserRepository } from '@/infra/repositories/user.repository'
import { UserModel } from '@generated/prisma/models/User'
import { MetricProcessService } from '@/domain/report/use-cases/get-report/metric-process.service'

export type GetReportArgs = {
  metrics: string[]
  groups: string[]
  sortField?: string
  sortOrder?: Direction
  filters: InputFilterData[]
}

@Injectable()
export class GetReportUseCase {
  constructor(
    @InjectKysely() private readonly db: Kysely<DB>,
    private readonly reportRepository: ReportRepository,
    private readonly checkArgsService: CheckArgsService,
    private readonly filterProcessorService: FilterProcessorService,
    private readonly metricProcessorService: MetricProcessService,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(
    args: GetReportDto,
    userEmail: string,
  ): Promise<Record<string, string | number>> {
    this.checkArgsService.checkArgs(args)

    const { usedIdentifiers, identifierMap } = this.getIdentifierMapProxy()

    const { timeZone } = await this.getUserByEmail(userEmail)
    await this.reportRepository.setTimezone(timeZone)

    this.reportRepository.addConversionsIdentifiers(
      identifierMap,
      Object.keys(conversionTypes),
    )

    const qb = ReportQueryBuilder.create(this.db)
    qb.setConversionTypes(Object.keys(conversionTypes))

    this.filterProcessorService.process(qb, identifierMap, args.filter)
    this.processOrder(qb, args.sortField, args.sortOrder)
    this.processGroups(args.groups, qb)
    this.metricProcessorService.process(qb, identifierMap, args.metrics)

    qb.includeConversionFields(usedIdentifiers)

    // console.log(qb.sql())

    return qb.execute()
  }

  private processOrder(
    qb: ReportQueryBuilder,
    sortField?: string,
    sortOrder: Direction = Direction.asc,
  ): void {
    if (!sortField) {
      return
    }

    qb.orderBy(sortField, sortOrder)
  }

  private processGroups(groupKeys: string[], qb: ReportQueryBuilder): void {
    for (const groupKey of groupKeys) {
      if (!(groupKey in groups)) {
        throw new Error('Unknown group key ' + groupKey)
      }

      const { sql: query, include } = groups[groupKey]

      if (!query) {
        qb.select(groupKey)
        qb.groupByClickField(groupKey)
        continue
      }

      switch (include) {
        case 'affiliateNetwork':
          qb.selectAffiliateNetworkName()
          break
        case 'offer':
          qb.selectOfferName()
          break
        case 'stream':
          qb.selectStreamName()
          break
        case 'campaign':
          qb.selectCampaignName()
          break
        case 'source':
          qb.selectSourceName()
          break
        default:
          qb.selectRaw(query, groupKey)
          qb.groupBy(groupKey)
      }
    }
  }

  private getIdentifierMapProxy(): {
    identifierMap: IdentifierMap
    usedIdentifiers: string[]
  } {
    const usedIdentifiers: string[] = []
    const identifierMap = new Proxy(this.reportRepository.getIdentifierMap(), {
      get(target, key: string): string {
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
