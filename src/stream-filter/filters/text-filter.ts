import { StreamFilter, TextFilterObject } from '@/stream-filter/types'

export class TextFilter implements StreamFilter {
  constructor(
    private readonly filterObj: TextFilterObject,
    private readonly value?: string,
  ) {}

  handle(): boolean {
    const values = this.filterObj.values

    if (values.length === 0) {
      return false
    }

    return values.includes(this.value?.toString() || '')
  }
}
