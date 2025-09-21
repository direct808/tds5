import { ConversionStatusService } from '@/domain/conversion/conversion-status.service'
import { MockRequestAdapter } from '../../../test/utils/mock-request-adapter'
import { ConversionStatus } from '@/domain/conversion/conversion.entity'

describe('conversion-status.service.ts', () => {
  let service: ConversionStatusService

  beforeEach(() => {
    service = new ConversionStatusService()
  })

  it('Should return status sale if status not provide', () => {
    const requestProvider = MockRequestAdapter.create()
    const status = service.getStatus(requestProvider)
    expect(status).toEqual(ConversionStatus.sale)
  })

  it('Should return status rejected if status is rejected', () => {
    const requestProvider = MockRequestAdapter.create({
      query: { status: ConversionStatus.rejected },
    })
    const status = service.getStatus(requestProvider)
    expect(status).toEqual(ConversionStatus.rejected)
  })

  it('Should return status rejected if status is custom-status', () => {
    const requestProvider = MockRequestAdapter.create({
      query: {
        status: 'custom-status',
        rejected_status: 'staus1,custom-status',
      },
    })
    const status = service.getStatus(requestProvider)
    expect(status).toEqual(ConversionStatus.rejected)
  })

  it('Should return status led if unknown status', () => {
    const requestProvider = MockRequestAdapter.create({
      query: {
        status: 'custom-status',
      },
    })
    const status = service.getStatus(requestProvider)
    expect(status).toEqual(ConversionStatus.lead)
  })
})
