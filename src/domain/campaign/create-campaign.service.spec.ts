import { Test, TestingModule } from '@nestjs/testing'
import { CreateCampaignService } from './create-campaign.service'
import { CommonCampaignService } from './common-campaign.service'
import { CreateStreamService } from './stream/create-stream.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { checkUniqueNameForCreate } from '@/infra/repositories/utils/repository-utils'
import { PrismaClient } from '../../../generated/prisma/client'
import { TransactionFactory } from '@/infra/database/transaction-factory'
import { Transaction } from '@/infra/prisma/prisma-transaction'

jest.mock('@/infra/repositories/utils/repository-utils')

const args = {
  name: 'test',
  sourceId: 'source-123',
  active: true,
  userId: 'user-1',
  streams: [],
}

describe('CreateCampaignService', () => {
  let service: CreateCampaignService
  const transactionFactory = {
    create: jest.fn().mockImplementation((cb) => cb(prisma)),
  }
  const repository = {
    create: jest.fn().mockResolvedValue({ id: 'campaign-1' }),
  }
  const createStreamService = {
    createStreams: jest.fn(),
  }
  const commonCampaignService = {
    ensureSourceExists: jest.fn(),
  }
  const prisma = {} as PrismaClient
  const transaction = {} as Transaction

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignService,
        EventEmitter2,
        {
          provide: TransactionFactory,
          useValue: transactionFactory,
        },
        {
          provide: CampaignRepository,
          useValue: repository,
        },
        {
          provide: CreateStreamService,
          useValue: createStreamService,
        },
        {
          provide: CommonCampaignService,
          useValue: commonCampaignService,
        },
      ],
    }).compile()

    service = module.get(CreateCampaignService)

    jest.clearAllMocks()
  })

  it('should use transaction when manager is not provided', async () => {
    await service.create(args, null)
    expect(transactionFactory.create).toHaveBeenCalled()
  })

  it('should not use transaction when manager is provided', async () => {
    await service.create(args, transaction)
    expect(transactionFactory.create).not.toHaveBeenCalled()
  })

  it('should call ensureSourceExists', async () => {
    await service.create(args, transaction)
    expect(commonCampaignService.ensureSourceExists).toHaveBeenCalledWith(
      args.userId,
      args.sourceId,
    )
  })

  it('should call checkUniqueNameForCreate', async () => {
    await service.create(args, transaction)
    expect(checkUniqueNameForCreate).toHaveBeenCalledWith(repository, args)
  })

  it('should call repository.create with correct data', async () => {
    await service.create(args, transaction)
    expect(repository.create).toHaveBeenCalledWith(
      prisma,
      expect.objectContaining({
        name: args.name,
        sourceId: args.sourceId,
        active: args.active,
        userId: args.userId,
      }),
    )
  })

  it('should call createStreamService.createStreams with correct params', async () => {
    await service.create(args, transaction)
    expect(createStreamService.createStreams).toHaveBeenCalledWith(
      prisma,
      'campaign-1',
      args.userId,
      args.streams,
    )
  })

  it('should call buildCreateData witch correct result', () => {
    jest.spyOn(service as any, 'makeCode').mockReturnValue('code')
    const data = service['buildCreateData'](args)
    expect(data).toEqual({
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
      userId: args.userId,
      code: 'code',
    })
  })
})
