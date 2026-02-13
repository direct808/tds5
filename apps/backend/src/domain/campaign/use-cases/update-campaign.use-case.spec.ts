import { UpdateStreamService } from '../stream/update-stream.service'
import { Test, TestingModule } from '@nestjs/testing'
import { UpdateCampaignUseCase } from './update-campaign.use-case'
import { CampaignService } from '../campaign.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { checkUniqueNameForUpdate } from '../../../infra/repositories/utils/repository-utils'
import { CampaignRepository } from '../../../infra/repositories/campaign.repository'
import { PrismaClient } from '@generated/prisma/client'
import { TransactionFactory } from '../../../infra/database/transaction-factory'
import { Transaction } from '../../../infra/prisma/prisma-transaction'

jest.mock('../../../infra/repositories/utils/repository-utils')

const args = {
  id: 'id-1',
  name: 'test',
  sourceId: 'source-123',
  active: true,
  userId: 'user-1',
  streams: [],
}

describe('UpdateCampaignUseCase', () => {
  let useCase: UpdateCampaignUseCase
  const transactionFactory = {
    create: jest.fn().mockImplementation((cb) => cb(prisma)),
  }
  const repository = {
    update: jest.fn(),
    getByIdsAndUserId: jest.fn().mockResolvedValue([{}]),
  }
  const updateStreamService = {
    updateStreams: jest.fn(),
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
        UpdateCampaignUseCase,
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
          provide: UpdateStreamService,
          useValue: updateStreamService,
        },
        {
          provide: CampaignService,
          useValue: commonCampaignService,
        },
      ],
    }).compile()

    useCase = module.get(UpdateCampaignUseCase)

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
    expect(checkUniqueNameForUpdate).toHaveBeenCalledWith(repository, args)
  })

  it('should not call checkUniqueNameForCreate without name', async () => {
    const { name, ...argsWithoutName } = args
    await useCase.execute(argsWithoutName as any, transaction)
    expect(checkUniqueNameForUpdate).not.toHaveBeenCalled()
  })

  it('should call repository.update with correct data', async () => {
    await useCase.execute(args, transaction)
    expect(repository.update).toHaveBeenCalledWith(
      prisma,
      args.id,
      expect.objectContaining({
        name: args.name,
        sourceId: args.sourceId,
        active: args.active,
      }),
    )
  })

  it('should call updateStreams with correct params', async () => {
    await useCase.execute(args, transaction)
    expect(updateStreamService.updateStreams).toHaveBeenCalledWith(
      prisma,
      args.id,
      args.userId,
      args.streams,
    )
  })

  it('should call buildUpdateData witch correct result', () => {
    const data = useCase['buildUpdateData'](args)
    expect(data).toEqual({
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
    })
  })
})
