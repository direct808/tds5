import { Injectable } from '@nestjs/common'
import { RequestAdapter } from '@/shared/request-adapter'
import { ConversionTypeIterator } from '@/domain/conversion/conversion-type.iterator'

@Injectable()
export class ConversionTypeService {
  constructor(private readonly iterator: ConversionTypeIterator) {}

  public getType(
    originalStatus: string,
    requestAdapter: RequestAdapter,
  ): string | undefined {
    return (
      this.getExactMatch(originalStatus) ||
      this.getByLearningStatus(originalStatus, requestAdapter)
    )
  }

  private getExactMatch(originalStatus: string): string | undefined {
    for (const { type, conversionType } of this.iterator.get()) {
      if (conversionType.parameterValues.includes(originalStatus)) {
        return type
      }
    }
  }

  private getByLearningStatus(
    originalStatus: string,
    requestAdapter: RequestAdapter,
  ): string | undefined {
    for (const { type } of this.iterator.get()) {
      const statuses =
        requestAdapter.query(`${type}_status`)?.trim().split(',') ?? []

      if (statuses.includes(originalStatus)) {
        return type
      }
    }
  }
}
