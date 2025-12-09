import { Injectable } from '@nestjs/common'
import { FilterService } from './filter/filter.service'

interface StreamSimple {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any // todo убери это
}

@Injectable()
export class SelectStreamService {
  constructor(private readonly streamFilterService: FilterService) {}

  public async selectStream<T extends StreamSimple>(streams: T[]): Promise<T> {
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

  private async checkStreamFilters(stream: StreamSimple): Promise<boolean> {
    const filters = stream.filters
    if (!filters || filters.items.length === 0) {
      return true
    }

    return this.streamFilterService.checkFilters(filters, stream.id)
  }
}
