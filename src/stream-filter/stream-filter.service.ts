import { FilterLogic, FilterObject, Filters } from '@/stream-filter/types'
import { ClickData } from '@/click/click-data'
import { Injectable } from '@nestjs/common'
import { RequestAdapter } from '@/utils/request-adapter'
import { StreamFilterFactory } from '@/stream-filter/stream-filter-factory'
import { ClickLimitProvider } from '@/stream-filter/filters/click-limit-filter'

@Injectable()
export class StreamFilterService {
  constructor(private readonly streamFilterFactory: StreamFilterFactory) {}

  public async checkFilters(
    filters: Filters,
    clickData: ClickData,
    request: RequestAdapter,
  ) {
    let resultValue = true

    for (const filter of filters.items) {
      const result = await this.checkFilter(
        filter,
        clickData,
        filters.logic,
        request,
      )

      if (result.break) {
        return result.value
      }

      resultValue = resultValue && result.value
    }

    return resultValue
  }

  private async checkFilter(
    filter: FilterObject,
    clickData: ClickData,
    logic: FilterLogic,
    request: RequestAdapter,
  ): Promise<{ value: boolean; break?: true }> {
    const result = await this.filter(filter, clickData, request)

    if (result && logic === FilterLogic.Or) {
      return { value: result, break: true }
    }

    if (!result && logic === FilterLogic.And) {
      return { value: result, break: true }
    }

    return { value: result }
  }

  private async filter(
    filter: FilterObject,
    clickData: ClickData,
    request: RequestAdapter,
    clickLimitProvider: ClickLimitProvider,
  ): Promise<boolean> {
    const result = await this.handle(
      filter,
      clickData,
      request,
      clickLimitProvider,
    )
    return this.processExclude(result, filter.exclude)
  }

  private processExclude(result: boolean, exclude?: boolean) {
    return exclude ? !result : result
  }

  private handle(
    filter: FilterObject,
    clickData: ClickData,
    request: RequestAdapter,
    clickLimitProvider: ClickLimitProvider,
  ) {
    return this.streamFilterFactory
      .create(filter, clickData, request, clickLimitProvider)
      .handle()
  }
}
