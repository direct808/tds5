import { Injectable } from '@nestjs/common'
import { Filters } from '@/stream-filter/types'
import { StreamFilterService } from '@/stream-filter/stream-filter.service'

interface StreamWithFilters {
  filters: Filters | null
}

@Injectable()
export class SelectStreamService {
  constructor(private readonly streamFilterService: StreamFilterService) {}

  public async selectStream<T extends StreamWithFilters>(
    streams: T[],
  ): Promise<T> {
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

  private async checkStreamFilters(
    stream: StreamWithFilters,
  ): Promise<boolean> {
    const filters = stream.filters
    if (!filters || filters.items.length === 0) {
      return true
    }

    return this.streamFilterService.checkFilters(filters)
  }
}
