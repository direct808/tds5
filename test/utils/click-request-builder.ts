import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import TestAgent from 'supertest/lib/agent'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { setTimeout } from 'timers'
import { clickRegisteredEventName } from '@/domain/click/events/click-registered.event'

export class ClickRequestBuilder {
  private campaignCode: string | undefined
  private visitorId: string | undefined
  private readonly q = new URLSearchParams()
  private readonly headers: Record<string, string> = {}
  private needWaitClickRegistered = false

  private constructor(private readonly app: INestApplication) {}

  public static create(app: INestApplication): ClickRequestBuilder {
    return new this(app)
  }

  public code(code: string): this {
    this.campaignCode = code

    return this
  }

  public setVisitorId(visitorId: string): this {
    this.visitorId = visitorId

    return this
  }

  public addQueryParam(name: string, value: string): this {
    this.q.append(name, value)

    return this
  }

  public addHeader(name: string, value: string): this {
    this.headers[name] = value

    return this
  }

  public waitRegister(): this {
    this.needWaitClickRegistered = true

    return this
  }

  public request(): ReturnType<TestAgent['get']> {
    const req = request(this.app.getHttpServer())
    if (!this.campaignCode) {
      throw new Error('Code not set')
    }

    let url = '/' + this.campaignCode
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

    if (this.needWaitClickRegistered) {
      this.replaceThen(superTest)
    }

    return superTest
  }

  private replaceThen(superTest: Promise<any>): void {
    const app = this.app
    const waitClickRegistered = this.waitClickRegistered
    const origThen = superTest.then.bind(superTest)

    superTest.then = function (onFulfilled?: any, onRejected?: any): any {
      return origThen(async (value: any) => {
        try {
          await waitClickRegistered(app)
        } catch (err) {
          if (onRejected) {
            return onRejected(err)
          }
          throw err
        }
        if (onFulfilled) {
          return onFulfilled(value)
        }

        return value
      }, onRejected)
    }
  }

  private async waitClickRegistered(app: INestApplication): Promise<void> {
    const emitter = app.get(EventEmitter2)

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Wait click registered timeout')),
        1000,
      )

      emitter.once(clickRegisteredEventName, () => {
        clearTimeout(timeout)
        resolve()
      })
    })
  }
}
