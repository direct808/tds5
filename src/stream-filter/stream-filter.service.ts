import { FilterLogic, FilterObject, Filters } from '@/stream-filter/types'
import { ClickData } from '@/click/click-data'
import { StreamFilterFactory } from '@/stream-filter/stream-filter-factory'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StreamFilterService {
  constructor(private readonly streamFilterFactory: StreamFilterFactory) {}

  public checkFilters(filters: Filters, clickData: ClickData) {
    let resultValue = true

    for (const filter of filters.items) {
      const result = this.checkFilter(filter, clickData, filters.logic)

      if (result.break) {
        return result.value
      }

      resultValue = resultValue && result.value
    }

    return resultValue
  }

  private checkFilter(
    filter: FilterObject,
    clickData: ClickData,
    logic: FilterLogic,
  ): { value: boolean; break?: true } {
    const result = this.filter(filter, clickData)

    if (result && logic === FilterLogic.Or) {
      return { value: result, break: true }
    }

    if (!result && logic === FilterLogic.And) {
      return { value: result, break: true }
    }

    return { value: result }
  }

  private filter(filter: FilterObject, clickData: ClickData): boolean {
    const result = this.streamFilterFactory.create(filter).handle(clickData)
    return filter.exclude ? !result : result
  }
}
