import { Injectable } from '@nestjs/common'
import { RequestAdapter } from '@/shared/request-adapter'
import { ConversionType } from '@/domain/conversion/conversion-type'

const stausMap = [
  ['sale_status', ConversionType.sale],
  ['rejected_status', ConversionType.rejected],
  ['lead_status', ConversionType.lead],
] as const

@Injectable()
export class ConversionStatusService {
  public getStatus(requestAdapter: RequestAdapter): ConversionType {
    const originalStatus = requestAdapter.query('status')

    if (!originalStatus) {
      return ConversionType.sale
    }

    if (
      Object.values(ConversionType).includes(originalStatus as ConversionType)
    ) {
      return originalStatus as ConversionType
    }

    for (const [name, status] of stausMap) {
      const st = requestAdapter.query(name)?.trim().split(',') ?? []
      if (st.includes(originalStatus)) {
        return status
      }
    }

    return ConversionType.lead
  }
}
