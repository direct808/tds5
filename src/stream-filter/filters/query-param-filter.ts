import { QueryParamFilterObject, StreamFilter } from '../types'
import { RequestAdapter } from '@/utils/request-adapter'

export class QueryParamFilter implements StreamFilter {
  constructor(
    private readonly filterObj: QueryParamFilterObject,
    private readonly request: RequestAdapter,
  ) {}

  handle(): boolean {
    const values = this.filterObj.values
    const name = this.filterObj.name

    const value = this.request.query(name)

    if (!value || values.length === 0) {
      return false
    }

    return values.includes(value || '')
  }
}
