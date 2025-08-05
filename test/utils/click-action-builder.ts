import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

export class ClickActionBuilder {
  private code: string | undefined
  private visitorId: string | undefined
  private readonly q = new URLSearchParams()
  private readonly headers: Record<string, string> = {}

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

  public addHeader(name: string, value: string) {
    this.headers[name] = value
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

    let superTest = req.get(url)

    if (this.visitorId) {
      superTest = superTest.set('Cookie', ['visitorId=' + this.visitorId])
    }

    for (const [name, value] of Object.entries(this.headers)) {
      superTest = superTest.set(name, value)
    }

    return superTest
  }
}
