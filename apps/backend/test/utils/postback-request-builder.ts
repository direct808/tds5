import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import TestAgent from 'supertest/lib/agent'
import { AppConfig } from '../../src/infra/config/app-config.service'

export class PostbackRequestBuilder {
  private _subid: string | undefined
  private readonly q = new URLSearchParams()

  private constructor(private readonly app: INestApplication) {}

  public static create(app: INestApplication): PostbackRequestBuilder {
    return new this(app)
  }

  public subid(clickId: string): this {
    this._subid = clickId

    return this
  }

  public addQueryParam(name: string, value: string): this {
    this.q.append(name, value)

    return this
  }

  public request(): ReturnType<TestAgent['get']> {
    const req = request(this.app.getHttpServer())

    if (this._subid) {
      this.q.set('subid', this._subid)
    }

    const { postbackKey } = this.app.get(AppConfig)

    let url = `/${postbackKey}/postback`
    if (this.q.size > 0) {
      url += '?' + this.q.toString()
    }

    return req.get(url)
  }
}
