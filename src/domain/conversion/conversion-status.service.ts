import { Injectable } from '@nestjs/common'
import { ConversionStatus } from '@/domain/conversion/conversion.entity'
import { RequestAdapter } from '@/shared/request-adapter'

const stausMap = [
  ['sale_status', ConversionStatus.sale],
  ['rejected_status', ConversionStatus.rejected],
  ['lead_status', ConversionStatus.lead],
] as const

@Injectable()
export class ConversionStatusService {
  public getStatus(requestAdapter: RequestAdapter): ConversionStatus {
    const originalStatus = requestAdapter.query('status')

    if (!originalStatus) {
      return ConversionStatus.sale
    }

    if (
      Object.values(ConversionStatus).includes(
        originalStatus as ConversionStatus,
      )
    ) {
      return originalStatus as ConversionStatus
    }

    for (const [name, status] of stausMap) {
      const st = requestAdapter.query(name)?.trim().split(',') ?? []
      if (st.includes(originalStatus)) {
        return status
      }
    }

    return ConversionStatus.lead
  }
}
