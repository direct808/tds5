import { ConversionTypeService } from '@/domain/conversion/conversion-type.service'
import { MockRequestAdapter } from '../../../test/utils/mock-request-adapter'
import { ConversionType } from '@/domain/conversion/conversion-type'

describe('conversion-status.service.ts', () => {
  let service: ConversionTypeService

  beforeEach(() => {
    service = new ConversionTypeService()
  })

  it('Should return status sale if status not provide', () => {
    const requestProvider = MockRequestAdapter.create()
    const status = service.getType(requestProvider)
    expect(status).toEqual(ConversionType.sale)
  })

  it('Should return status rejected if status is rejected', () => {
    const requestProvider = MockRequestAdapter.create({
      query: { status: ConversionType.rejected },
    })
    const status = service.getType(requestProvider)
    expect(status).toEqual(ConversionType.rejected)
  })

  it('Should return status rejected if status is custom-status', () => {
    const requestProvider = MockRequestAdapter.create({
      query: {
        status: 'custom-status',
        rejected_status: 'staus1,custom-status',
      },
    })
    const status = service.getType(requestProvider)
    expect(status).toEqual(ConversionType.rejected)
  })

  it('Should return status led if unknown status', () => {
    const requestProvider = MockRequestAdapter.create({
      query: {
        status: 'custom-status',
      },
    })
    const status = service.getType(requestProvider)
    expect(status).toEqual(ConversionType.lead)
  })
})
