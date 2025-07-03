import { Injectable } from '@nestjs/common'
import { FilterObject, StreamFilter } from '@/stream-filter/types'
import { TextFilter } from '@/stream-filter/filters/text-filter'
import { QueryParamFilter } from '@/stream-filter/filters/qury-param-filter'

@Injectable()
export class StreamFilterFactory {
  create(filterObj: FilterObject): StreamFilter {
    switch (filterObj.type) {
      case 'referer':
        return new TextFilter(filterObj)
      case 'query-param':
        return new QueryParamFilter(filterObj)
      default:
        throw new Error(`Unknown filter type ${filterObj.type}`)
    }
  }
}
