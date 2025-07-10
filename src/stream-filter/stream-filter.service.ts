import { FilterLogic, FilterObject, Filters } from '@/stream-filter/types'
import { Injectable } from '@nestjs/common'
import { StreamFilterFactory } from '@/stream-filter/stream-filter-factory'

@Injectable()
export class StreamFilterService {
  constructor(private readonly streamFilterFactory: StreamFilterFactory) {}

  public async checkFilters(filters: Filters) {
    let resultValue = true

    for (const filter of filters.items) {
      const result = await this.checkFilter(filter, filters.logic)

      if (result.break) {
        return result.value
      }

      resultValue = resultValue && result.value
    }

    return resultValue
  }

  private async checkFilter(
    filter: FilterObject,
    logic: FilterLogic,
  ): Promise<{ value: boolean; break?: true }> {
    const result = await this.filter(filter)

    if (result && logic === FilterLogic.Or) {
      return { value: result, break: true }
    }

    if (!result && logic === FilterLogic.And) {
      return { value: result, break: true }
    }

    return { value: result }
  }

  private async filter(filter: FilterObject): Promise<boolean> {
    const result = await this.handle(filter)
    return this.processExclude(result, filter.exclude)
  }

  private processExclude(result: boolean, exclude?: boolean) {
    return exclude ? !result : result
  }

  private handle(filter: FilterObject) {
    return this.streamFilterFactory.create(filter).handle()
  }
}
