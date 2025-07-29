import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

export class ClickActionBuilder {
  private code: string | undefined
  private visitorId: string | undefined
  private readonly q = new URLSearchParams()

  private constructor(private readonly app: INestApplication) {}

  public static create(app: INestApplication) {
    return new ClickActionBuilder(app)
  }

  public setCode(code: string) {
    this.code = code
    return this
  }

  public setVisitorId(visitorId: string) {
    this.visitorId = visitorId
    return this
  }

  public addQueryParam(name: string, value: string) {
    this.q.append(name, value)
    return this
  }

  public request() {
    const req = request(this.app.getHttpServer())
    if (!this.code) {
      throw new Error('Code not set')
    }

    let url = '/' + this.code
    if (this.q.size > 0) {
      url += '?' + this.q.toString()
    }

    let asd = req.get(url)

    if (this.visitorId) {
      asd = asd.set('Cookie', ['visitorId=' + this.visitorId])
    }

    return asd
  }
}
