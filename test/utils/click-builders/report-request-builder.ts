import { INestApplication } from '@nestjs/common'
import TestAgent from 'supertest/lib/agent'
import request from 'supertest'

export class ReportRequestBuilder {
  private _groups: string[] | undefined
  private _metrics: string[] | undefined
  private _filter: any[][] | undefined

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

  public addFilter(
    field: string,
    operation: string,
    value: string | boolean | number,
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

    return req.get('/report').query(query)
  }
}
