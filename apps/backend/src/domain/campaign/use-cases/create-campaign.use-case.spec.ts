import { Test, TestingModule } from '@nestjs/testing'
import { CampaignService } from '../campaign.service'
import { CreateStreamService } from '../stream/create-stream.service'
import { CreateCampaignUseCase } from './create-campaign.use-case'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CampaignRepository } from '../../../infra/repositories/campaign.repository'
import { checkUniqueNameForCreate } from '../../../infra/repositories/utils/repository-utils'
import { PrismaClient } from '@generated/prisma/client'
import { TransactionFactory } from '../../../infra/database/transaction-factory'
import { Transaction } from '../../../infra/prisma/prisma-transaction'

jest.mock('../../../infra/repositories/utils/repository-utils')

const args = {
  name: 'test',
  sourceId: 'source-123',
  active: true,
  userId: 'user-1',
  streams: [],
}

describe('CreateCampaignUseCase', () => {
  let useCase: CreateCampaignUseCase
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
    ensureDomainExists: jest.fn(),
  }
  const prisma = {} as PrismaClient
  const transaction = {} as Transaction

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignUseCase,
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
          provide: CampaignService,
          useValue: commonCampaignService,
        },
      ],
    }).compile()

    useCase = module.get(CreateCampaignUseCase)

    jest.clearAllMocks()
  })

  it('should use transaction when manager is not provided', async () => {
    await useCase.execute(args, null)
    expect(transactionFactory.create).toHaveBeenCalled()
  })

  it('should not use transaction when manager is provided', async () => {
    await useCase.execute(args, transaction)
    expect(transactionFactory.create).not.toHaveBeenCalled()
  })

  it('should call ensureSourceExists', async () => {
    await useCase.execute(args, transaction)
    expect(commonCampaignService.ensureSourceExists).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: args.userId,
        sourceId: args.sourceId,
      }),
    )
  })

  it('should call checkUniqueNameForCreate', async () => {
    await useCase.execute(args, transaction)
    expect(checkUniqueNameForCreate).toHaveBeenCalledWith(repository, args)
  })

  it('should call repository.create with correct data', async () => {
    await useCase.execute(args, transaction)
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
    await useCase.execute(args, transaction)
    expect(createStreamService.createStreams).toHaveBeenCalledWith(
      prisma,
      'campaign-1',
      args.userId,
      args.streams,
    )
  })

  it('should call buildCreateData witch correct result', () => {
    jest.spyOn(useCase as any, 'makeCode').mockReturnValue('code')
    const data = useCase['buildCreateData'](args)
    expect(data).toEqual({
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
      userId: args.userId,
      code: 'code',
    })
  })
})
