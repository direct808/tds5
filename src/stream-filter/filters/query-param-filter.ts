import { QueryParamFilterObject, StreamFilter } from '@/stream-filter/types'
import { Request } from 'express'
import { RequestAdapter } from '@/utils/request-adapter'

export class QueryParamFilter implements StreamFilter {
  constructor(private readonly filterObj: QueryParamFilterObject) {}

  handle(request: RequestAdapter): boolean {
    const values = this.filterObj.values
    const name = this.filterObj.name

    // const asd = request.header('set-cookie')

    const value = request.query('name')

    if (!value || values.length === 0) {
      return false
    }

    return values.includes(value || '')
  }
}
