import { Injectable } from '@nestjs/common'
import { Filters } from '@/domain/click/stream/stream-filter/types'
import { StreamFilterService } from '@/domain/click/stream/stream-filter/stream-filter.service'

interface StreamSimple {
  id: string
  filters: Filters | null
}

@Injectable()
export class SelectStreamService {
  constructor(private readonly streamFilterService: StreamFilterService) {}

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
