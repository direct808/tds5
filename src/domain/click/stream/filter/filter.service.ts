import {
  FilterLogic,
  FilterObjectExtended,
  Filters,
} from '@/domain/click/stream/filter/types'
import { Inject, Injectable } from '@nestjs/common'
import {
  IStreamFilterFactory,
  FilterFactory,
} from '@/domain/click/stream/filter/filter-factory'
import { MaybePromise } from '@/shared/types'

@Injectable()
export class FilterService {
  constructor(
    @Inject(FilterFactory)
    private readonly streamFilterFactory: IStreamFilterFactory,
  ) {}

  public async checkFilters(
    filters: Filters,
    streamId: string,
  ): Promise<boolean> {
    let resultValue = true

    for (const filter of filters.items) {
      const result = await this.checkFilter(
        { ...filter, streamId },
        filters.logic,
      )

      if (result.break) {
        return result.value
      }

      resultValue = resultValue && result.value
    }

    return resultValue
  }

  private async checkFilter(
    filter: FilterObjectExtended,
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

  private async filter(filter: FilterObjectExtended): Promise<boolean> {
    const result = await this.handle(filter)

    return this.processExclude(result, filter.exclude)
  }

  private processExclude(result: boolean, exclude?: boolean): boolean {
    return exclude ? !result : result
  }

  private handle(filter: FilterObjectExtended): MaybePromise<boolean> {
    return this.streamFilterFactory.create(filter).handle()
  }
}
