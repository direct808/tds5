import { BadRequestException, Injectable } from '@nestjs/common'
import { conversionTypes } from '@/domain/conversion/types'
import { ReportQueryBuilder } from '@/domain/report/report-query-builder'
import {
  IdentifierMap,
  ReportRepository,
} from '@/infra/repositories/report.repository'
import { Group, groups } from '@/domain/report/groups'
import { formulas } from '@/domain/report/formulas'
import { FormulaParser } from '@/domain/report/formula-parser'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely } from 'kysely'
import { DB } from '@generated/kysely'
import { Direction } from '@/domain/report/types'
import { CheckArgsService } from '@/domain/report/use-cases/get-report/check-args.service'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'
import { isIPv4 } from 'node:net'

// type OperatorNumeric = 'equal' | 'not_equal' | 'less_then' | 'greater_then'
// type OperatorList = 'equal' | 'not_equal' | 'in' | 'not_in'
// type OperatorBoolean = 'is_true' | 'is_false'
// type OperatorString =
//   | 'equal'
//   | 'not_equal'
//   | 'contains'
//   | 'not_contains'
//   | 'match_regexp'
//   | 'not_match_regexp'
//   | 'begins_with'
//   | 'ends_with'
// type OperatorEqualsOrNot = 'equal' | 'not_equal'
// type OperatorIp = 'equal' | 'not_equal' | 'begins_with' | 'between'

// type FilterNumeric = {
//   type: 'numeric'
//   field: string
//   operator: OperatorNumeric
//   value: number
// }
//
// type FilterList = {
//   type: 'list'
//   field: string
//   operator: OperatorList
//   value: (number | string)[]
// }
//
// type FilterBoolean = {
//   type: 'boolean'
//   field: string
//   operator: OperatorBoolean
//   value: boolean
// }
//
// type FilterString = {
//   type: 'string'
//   field: string
//   operator: OperatorString
//   value: string
// }
//
// type FilterEqualsOrNot = {
//   type: 'equals_or_not'
//   field: string
//   operator: OperatorEqualsOrNot
//   value: string | number
// }
//
// type FilterIp = {
//   type: 'ip'
//   field: string
//   operator: OperatorIp
//   value: string
// }

// type Filter =
//   | FilterNumeric
//   | FilterList
//   | FilterBoolean
//   | FilterString
//   | FilterEqualsOrNot
//   | FilterIp

export type GetReportArgs = {
  metrics: string[]
  groups: string[]
  sortField?: string
  sortOrder?: Direction
  filters: any[][]
}

@Injectable()
export class GetReportUseCase {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly checkArgsService: CheckArgsService,
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  public async handle(args: GetReportDto): Promise<any> {
    this.checkArgsService.checkArgs(args)

    const { usedIdentifiers, identifierMap } = this.getIdentifierMapProxy()

    await this.reportRepository.setTimezone('Europe/Moscow')

    this.reportRepository.addConversionsIdentifiers(
      identifierMap,
      Object.keys(conversionTypes),
    )

    const qb = ReportQueryBuilder.create(this.db).setConversionTypes(
      Object.keys(conversionTypes),
    )

    this.processFilter(qb, identifierMap, args.filter)
    this.processOrder(qb, args.sortField, args.sortOrder)
    this.processGroups(args.groups, qb)
    this.processMetrics(qb, identifierMap, args.metrics)
    qb.includeConversionFields(usedIdentifiers)

    console.log(qb.sql())

    return qb.execute()
  }

  private processFilter(
    qb: ReportQueryBuilder,
    identifierMap: IdentifierMap,
    filters: any[][],
  ): void {
    for (const filter of filters) {
      const [field, operator, value] = filter
      const formulaObj = formulas[field]
      const identifier = identifierMap[field]
      const group = groups[field]

      // const { operator, value } = this.convertFilterParts(filter)

      if (formulaObj) {
        const { formula } = formulaObj
        let query = FormulaParser.create(
          formula,
          identifierMap,
          formulas,
        ).build()
        query = `${query}`
        qb.having(query, operator, value)
      } else if (identifier) {
        qb.having(identifier, operator, value)
      } else if (group && group.filter !== null) {
        this.checkGroupValue(field, group, value)
        const query = group.sql ? group.sql : `"${field}"`
        qb.where(query, operator, value)
      } else {
        throw new BadRequestException('Unknown filter: ' + field)
      }
    }
  }

  private checkGroupValue(field: string, group: Group, value: unknown): void {
    switch (group.filter) {
      case 'boolean':
        if (typeof value !== 'boolean') {
          this.throwInvalidValue(field)
        }
        break
      case 'numeric':
        if (typeof value !== 'number') {
          this.throwInvalidValue(field)
        }
        break
      case 'string':
        if (typeof value !== 'string') {
          this.throwInvalidValue(field)
        }
        break
      case 'ip':
        if (!(typeof value === 'string' && isIPv4(value))) {
          this.throwInvalidValue(field)
        }
        break
      default:
        throw new Error('Unknown group.filter: ' + group.filter)
    }
  }

  private throwInvalidValue(field: string): never {
    throw new BadRequestException(`Invalid value for: ${field}`)
  }

  // private convertFilterParts(filter: any[]): {
  //   operator: string
  //   value: string | number | boolean
  // } {
  //   switch (filter.type) {
  //     case 'numeric':
  //       return { operator: filter.operator, value: filter.value }
  //     case 'boolean':
  //       return { operator: '=', value: filter.value }
  //   }
  //   throw new Error('Unknown type ' + (filter as any).type)
  // }

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

  private processMetrics(
    qb: ReportQueryBuilder,
    identifierMap: IdentifierMap,
    metrics: string[],
  ): void {
    for (const metric of metrics) {
      const formulaObj = formulas[metric]
      const identifier = identifierMap[metric]

      if (formulaObj) {
        const { formula, decimals } = formulaObj
        let query = FormulaParser.create(
          formula,
          identifierMap,
          formulas,
        ).build()
        query = `CAST(${query} AS DECIMAL(12,${decimals ?? 0}))`
        qb.selectRaw(query, metric)
      } else if (identifier) {
        qb.selectRaw(identifier, metric)
      } else {
        throw new Error('Unknown metric: ' + metric)
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
}
