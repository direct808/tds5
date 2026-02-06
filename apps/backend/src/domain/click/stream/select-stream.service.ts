import { Injectable } from '@nestjs/common'
import { FilterService } from './filter/filter.service'
import { StreamModel } from '@generated/prisma/models/Stream'
import { Filters } from './filter/types'

@Injectable()
export class SelectStreamService {
  constructor(private readonly streamFilterService: FilterService) {}

  public async selectStream<T extends StreamModel>(streams: T[]): Promise<T> {
    if (streams.length === 0) {
      throw new Error('No streams')
    }

    for (const stream of streams) {
      if (await this.checkStreamFilters(stream)) {
        return stream
      }
    }

    throw new Error(`Can't select stream`)
  }

  private async checkStreamFilters(stream: StreamModel): Promise<boolean> {
    const filters = stream.filters as unknown as Filters | undefined
    if (!filters || filters.items.length === 0) {
      return true
    }

    return this.streamFilterService.checkFilters(filters, stream.id)
  }
}
