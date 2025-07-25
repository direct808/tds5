import { IClickContext } from '@/click/shared/click-context.service'
import { RequestAdapter, ResponseAdapter } from '@/utils/request-adapter'
import { ClickData } from '@/click/click-data'

export class MockClickContext implements IClickContext {
  private requestAdapter?: RequestAdapter
  private responseAdapter?: ResponseAdapter
  private clickData?: ClickData

  static create() {
    return new MockClickContext()
  }

  getRequestAdapter(): RequestAdapter {
    if (!this.requestAdapter) {
      throw new Error('No requestAdapter')
    }
    return this.requestAdapter
  }

  setRequestAdapter(adapter: RequestAdapter) {
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

  getResponseAdapter() {
    if (!this.responseAdapter) {
      throw new Error('No responseAdapter')
    }
    return this.responseAdapter
  }
}
