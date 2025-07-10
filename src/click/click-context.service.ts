import { Injectable } from '@nestjs/common'
import { RequestAdapter, ResponseAdapter } from '@/utils/request-adapter'
import { ClsService, ClsStore } from 'nestjs-cls'
import { ClickData } from '@/click/click-data'

interface ClickContextClsStore extends ClsStore {
  requestAdapter?: RequestAdapter
  responseAdapter?: ResponseAdapter
  clickData?: ClickData
}

@Injectable()
export class ClickContextService {
  constructor(private readonly cls: ClsService<ClickContextClsStore>) {}

  getRequestAdapter(): RequestAdapter {
    const adapter = this.cls.get('requestAdapter')
    if (!adapter) {
      throw new Error('No requestAdapter')
    }
    return adapter
  }

  setRequestAdapter(adapter: RequestAdapter): void {
    this.cls.set('requestAdapter', adapter)
  }

  getClickData(): ClickData {
    const clickData = this.cls.get('clickData')
    if (!clickData) {
      throw new Error('No clickData')
    }
    return clickData
  }

  getResponseAdapter(): ResponseAdapter {
    const responseAdapter = this.cls.get('responseAdapter')
    if (!responseAdapter) {
      throw new Error('No responseAdapter')
    }
    return responseAdapter
  }
}
