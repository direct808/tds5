import { IClickContext } from '@/domain/click/shared/click-context.service'
import { RequestAdapter, ResponseAdapter } from 'src/shared/request-adapter'
import { ClickData } from '@/domain/click/click-data'

export class MockClickContext implements IClickContext {
  private requestAdapter?: RequestAdapter
  private responseAdapter?: ResponseAdapter
  private clickData?: ClickData

  static create(): MockClickContext {
    return new MockClickContext()
  }

  getRequestAdapter(): RequestAdapter {
    if (!this.requestAdapter) {
      throw new Error('No requestAdapter')
    }

    return this.requestAdapter
  }

  setRequestAdapter(adapter: RequestAdapter): MockClickContext {
    this.requestAdapter = adapter

    return this
  }

  createClickData(): this {
    this.clickData = {}

    return this
  }

  getClickData(): ClickData {
    if (!this.clickData) {
      throw new Error('No clickData')
    }

    return this.clickData
  }

  setResponseAdapter(responseAdapter: ResponseAdapter): void {
    this.responseAdapter = responseAdapter
  }

  getResponseAdapter(): ResponseAdapter {
    if (!this.responseAdapter) {
      throw new Error('No responseAdapter')
    }

    return this.responseAdapter
  }
}
