import { INestApplication } from '@nestjs/common'
import TestAgent from 'supertest/lib/agent'
import request from 'supertest'
import { FilterOperatorEnum, InputFilterData } from '@/domain/report/types'
import { GLOBAL_PREFIX } from '@/shared/constants'

export class ReportRequestBuilder {
  private _groups: string[] | undefined
  private _metrics: string[] | undefined
  private _filter: InputFilterData[] | undefined
  private sortField: string | undefined
  private sortOrder: 'asc' | 'desc' | undefined

  private constructor(private readonly app: INestApplication) {}

  public static create(app: INestApplication): ReportRequestBuilder {
    return new this(app)
  }

  public groups(groups: string[]): this {
    this._groups = groups

    return this
  }

  public metrics(metrics: string[]): this {
    this._metrics = metrics

    return this
  }

  public sort(sortField: string, sortOrder: 'asc' | 'desc'): this {
    this.sortField = sortField
    this.sortOrder = sortOrder

    return this
  }

  public addFilter(
    field: string,
    operation: FilterOperatorEnum,
    value: unknown,
  ): this {
    this._filter = this._filter || []
    this._filter.push([field, operation, value])

    return this
  }

  public request(): ReturnType<TestAgent['get']> {
    const req = request(this.app.getHttpServer())

    const query: Record<string, string[] | string> = {}

    if (this._groups) {
      query['groups[]'] = this._groups
    }
    if (this._metrics) {
      query['metrics[]'] = this._metrics
    }
    if (this._filter) {
      query['filter'] = JSON.stringify(this._filter)
    }

    if (this.sortField) {
      query['sortField'] = this.sortField
    }

    if (this.sortOrder) {
      query['sortOrder'] = this.sortOrder
    }

    return req.get(`/${GLOBAL_PREFIX}report`).query(query)
  }
}
