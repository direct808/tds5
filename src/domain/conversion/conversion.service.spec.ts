import { MockRequestAdapter } from '../../../test/utils/mock-request-adapter'
import { Test, TestingModule } from '@nestjs/testing'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import { ConversionStatusService } from '@/domain/conversion/conversion-status.service'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { ConversionService } from '@/domain/conversion/conversion.service'

describe('conversion.service.ts', () => {
  let service: ConversionService
  const conversionUpdate = jest.fn()
  const conversionCreate = jest.fn()
  const conversionGetByClickId = jest.fn()
  const clickGetById = jest.fn()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversionService,
        ConversionStatusService,
        {
          provide: ConversionRepository,
          useValue: {
            update: conversionUpdate,
            create: conversionCreate,
            getByClickId: conversionGetByClickId,
          },
        },
        {
          provide: ClickRepository,
          useValue: { getById: clickGetById },
        },
      ],
    }).compile()

    service = module.get(ConversionService)
    jest.clearAllMocks()
  })

  it('Should not create conversion if clickId not provided', async () => {
    const requestProvider = MockRequestAdapter.create()
    await service.handle(requestProvider)

    expect(conversionUpdate).toBeCalledTimes(0)
    expect(conversionCreate).toBeCalledTimes(0)
  })

  it('Should not create conversion if click not found', async () => {
    const requestProvider = MockRequestAdapter.create({
      query: { subid: 'subid' },
    })
    clickGetById.mockReturnValue(null)
    await service.handle(requestProvider)

    expect(conversionUpdate).toBeCalledTimes(0)
    expect(conversionCreate).toBeCalledTimes(0)
  })

  it('Should create conversion if conversion not found', async () => {
    const requestProvider = MockRequestAdapter.create({
      query: { subid: 'subid' },
    })
    clickGetById.mockReturnValue({})
    await service.handle(requestProvider)

    expect(conversionUpdate).toBeCalledTimes(0)
    expect(conversionCreate).toBeCalledTimes(1)
  })

  it('Should update conversion if conversion exists', async () => {
    const requestProvider = MockRequestAdapter.create({
      query: { subid: 'subid' },
    })
    clickGetById.mockReturnValue({})
    conversionGetByClickId.mockReturnValue({})
    await service.handle(requestProvider)

    expect(conversionUpdate).toBeCalledTimes(1)
    expect(conversionCreate).toBeCalledTimes(0)
  })
})
