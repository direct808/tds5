import { Injectable } from '@nestjs/common'
import { RequestAdapter, ResponseAdapter } from 'src/shared/request-adapter'
import { ClsService, ClsStore } from 'nestjs-cls'
import { ClickData } from '@/domain/click/click-data'

interface ClickContextClsStore extends ClsStore {
  requestAdapter?: RequestAdapter
  responseAdapter?: ResponseAdapter
  clickData?: ClickData
}

export interface IClickContext {
  getRequestAdapter(): RequestAdapter
  setRequestAdapter(adapter: RequestAdapter): void
  createClickData(): void
  getClickData(): ClickData
  setResponseAdapter(adapter: ResponseAdapter): void
  getResponseAdapter(): ResponseAdapter
}

@Injectable()
export class ClickContext implements IClickContext {
  constructor(private readonly cls: ClsService<ClickContextClsStore>) {}

  public getRequestAdapter: IClickContext['getRequestAdapter'] = () => {
    const adapter = this.cls.get('requestAdapter')
    if (!adapter) {
      throw new Error('No requestAdapter')
    }

    return adapter
  }

  setRequestAdapter: IClickContext['setRequestAdapter'] = (adapter): void => {
    this.cls.set('requestAdapter', adapter)
  }

  createClickData(): void {
    this.cls.set('clickData', {} as ClickData)
  }

  getClickData(): ClickData {
    const clickData = this.cls.get('clickData')
    if (!clickData) {
      throw new Error('No clickData')
    }

    return clickData
  }

  setResponseAdapter(adapter: ResponseAdapter): void {
    this.cls.set('responseAdapter', adapter)
  }

  getResponseAdapter(): ResponseAdapter {
    const responseAdapter = this.cls.get('responseAdapter')
    if (!responseAdapter) {
      throw new Error('No responseAdapter')
    }

    return responseAdapter
  }
}
