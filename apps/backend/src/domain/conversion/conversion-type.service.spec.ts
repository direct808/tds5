import { ConversionTypeService } from './conversion-type.service'
import { MockRequestAdapter } from '../../../test/utils/mock-request-adapter'
import { Test, TestingModule } from '@nestjs/testing'
import { ConversionTypeIterator } from './conversion-type.iterator'

describe('conversion-type.service.ts', () => {
  let service: ConversionTypeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversionTypeService, ConversionTypeIterator],
    }).compile()
    service = module.get(ConversionTypeService)
  })

  it('Should return originalStatus', () => {
    const requestProvider = MockRequestAdapter.create()
    const status = service.getType('sale', requestProvider)
    expect(status).toEqual('sale')
  })

  it('Should return learning status', () => {
    const requestProvider = MockRequestAdapter.create().setQuery(
      'sale_status',
      'hz-status',
    )
    const status = service.getType('hz-status', requestProvider)
    expect(status).toEqual('sale')
  })
})
