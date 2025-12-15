import { ConversionRegisterUseCase } from '@/domain/conversion/use-cases/conversion-register.use-case'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import { ConversionTypeService } from '@/domain/conversion/conversion-type.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test, TestingModule } from '@nestjs/testing'
import {
  ConversionCreatedEvent,
  conversionCreatedEventName,
} from '@/domain/conversion/events/conversion-created.event'
import { MockRequestAdapter } from '../../../../test/utils/mock-request-adapter'
import { ClickModel } from '@generated/prisma/models/Click'
import { ConversionTypeIterator } from '@/domain/conversion/conversion-type.iterator'
import { ConversionModel } from '@generated/prisma/models/Conversion'

describe('ConversionRegisterUseCase', () => {
  let useCase: ConversionRegisterUseCase
  let clickRepo: jest.Mocked<ClickRepository>
  let conversionRepo: jest.Mocked<ConversionRepository>
  let eventEmitter: jest.Mocked<EventEmitter2>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversionRegisterUseCase,
        ConversionTypeService,
        ConversionTypeIterator,
        {
          provide: ClickRepository,
          useValue: { getById: jest.fn() },
        },
        {
          provide: ConversionRepository,
          useValue: {
            getByClickIdAndTid: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile()

    useCase = module.get(ConversionRegisterUseCase)
    clickRepo = module.get(ClickRepository)
    conversionRepo = module.get(ConversionRepository)
    eventEmitter = module.get(EventEmitter2)

    jest.clearAllMocks()
  })

  it('should create a new conversion if not exists', async () => {
    const requestAdapter = MockRequestAdapter.create()
      .query('subid', 'click-1')
      .query('status', 'sale')
      .query('tid', 'tid-1')
      .query('revenue', '100')
      .query('foo', 'bar')

    clickRepo.getById.mockResolvedValue({ id: 'click-1' } as ClickModel)
    // conversionRepo.getByClickIdAndTid.mockResolvedValue(null)
    // conversionTypeService.getType.mockReturnValue('approved')
    // conversionRepo.create.mockResolvedValue('conv-1')

    await useCase.handle(requestAdapter)

    expect(conversionRepo.create).toHaveBeenCalledTimes(1)
    expect(conversionRepo.create).toHaveBeenCalledWith({
      status: 'sale',
      clickId: 'click-1',
      originalStatus: 'sale',
      tid: 'tid-1',
      revenue: '100',
      params: {
        foo: 'bar',
        revenue: '100',
        status: 'sale',
        subid: 'click-1',
        tid: 'tid-1',
      },
    })

    expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      conversionCreatedEventName,
      expect.any(ConversionCreatedEvent),
    )
  })

  it('should update an existing conversion', async () => {
    const requestAdapter = MockRequestAdapter.create()
      .query('subid', 'click-1')
      .query('status', 'sale')
      .query('tid', 'tid-1')
      .query('revenue', '100')
      .query('foo', 'bar')

    clickRepo.getById.mockResolvedValue({ id: 'click-1' } as ClickModel)
    conversionRepo.getByClickIdAndTid.mockResolvedValue({
      id: 'id',
    } as ConversionModel)

    await useCase.handle(requestAdapter)

    expect(conversionRepo.update).toHaveBeenCalledTimes(1)
    expect(conversionRepo.update).toHaveBeenCalledWith('id', {
      status: 'sale',
      clickId: 'click-1',
      originalStatus: 'sale',
      tid: 'tid-1',
      revenue: '100',
      params: {
        foo: 'bar',
        revenue: '100',
        status: 'sale',
        subid: 'click-1',
        tid: 'tid-1',
      },
    })

    expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      conversionCreatedEventName,
      expect.any(ConversionCreatedEvent),
    )
  })

  it('should not create conversion if no provide subid', async () => {
    const requestAdapter = MockRequestAdapter.create()
      // .query('subid', 'click-1')
      .query('status', 'sale')
      .query('tid', 'tid-1')

    await useCase.handle(requestAdapter)

    expect(conversionRepo.update).not.toHaveBeenCalled()
    expect(conversionRepo.create).not.toHaveBeenCalled()
  })

  it('should not create conversion if no provide status', async () => {
    const requestAdapter = MockRequestAdapter.create()
      .query('subid', 'click-1')
      // .query('status', 'sale')
      .query('tid', 'tid-1')

    await useCase.handle(requestAdapter)

    expect(conversionRepo.update).not.toHaveBeenCalled()
    expect(conversionRepo.create).not.toHaveBeenCalled()
  })

  it('should not create conversion if tid length more then 50 chars', async () => {
    const requestAdapter = MockRequestAdapter.create()
      .query('subid', 'click-1')
      .query('status', 'sale')
      .query('tid', new Array(60).fill('1').join(''))

    clickRepo.getById.mockResolvedValue({ id: 'click-1' } as ClickModel)

    await useCase.handle(requestAdapter)

    expect(conversionRepo.update).not.toHaveBeenCalled()
    expect(conversionRepo.create).not.toHaveBeenCalled()
  })

  it('should not create conversion if click not found', async () => {
    const requestAdapter = MockRequestAdapter.create()
      .query('subid', 'click-1')
      .query('status', 'sale')
      .query('tid', 'tid-1')

    await useCase.handle(requestAdapter)

    expect(conversionRepo.update).not.toHaveBeenCalled()
    expect(conversionRepo.create).not.toHaveBeenCalled()
  })

  it('should not create conversion if unknown status', async () => {
    const requestAdapter = MockRequestAdapter.create()
      .query('subid', 'click-1')
      .query('status', 'hz-status')
      .query('tid', 'tid-1')

    clickRepo.getById.mockResolvedValue({ id: 'click-1' } as ClickModel)

    await useCase.handle(requestAdapter)

    expect(conversionRepo.update).not.toHaveBeenCalled()
    expect(conversionRepo.create).not.toHaveBeenCalled()
  })
})
