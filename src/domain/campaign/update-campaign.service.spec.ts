import { UpdateStreamService } from './stream/update-stream.service'
import { Test, TestingModule } from '@nestjs/testing'
import { UpdateCampaignService } from './update-campaign.service'
import { CommonCampaignService } from './common-campaign.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { checkUniqueNameForUpdate } from '@/infra/repositories/utils/repository-utils'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { PrismaClient } from '../../../generated/prisma/client'
import { TransactionFactory } from '@/infra/database/transaction-factory'

jest.mock('@/infra/repositories/utils/repository-utils')

const args = {
  id: 'id-1',
  name: 'test',
  sourceId: 'source-123',
  active: true,
  userId: 'user-1',
  streams: [],
}

describe('UpdateCampaignService', () => {
  let service: UpdateCampaignService
  const transactionFactory = {
    create: jest.fn().mockImplementation((cb) => cb(prisma)),
  }
  const repository = {
    update: jest.fn(),
    getByIdAndUserId: jest.fn().mockReturnValue(Promise.resolve({})),
  }
  const updateStreamService = {
    updateStreams: jest.fn(),
  }
  const commonCampaignService = {
    ensureSourceExists: jest.fn(),
  }
  const prisma = {} as PrismaClient

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCampaignService,
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
          provide: CommonCampaignService,
          useValue: commonCampaignService,
        },
      ],
    }).compile()

    service = module.get(UpdateCampaignService)

    jest.clearAllMocks()
  })

  it('should use transaction when manager is not provided', async () => {
    await service.update(args, null)
    expect(transactionFactory.create).toHaveBeenCalled()
  })

  it('should not use transaction when manager is provided', async () => {
    await service.update(args, prisma)
    expect(transactionFactory.create).not.toHaveBeenCalled()
  })

  it('should call ensureSourceExists', async () => {
    await service.update(args, prisma)
    expect(commonCampaignService.ensureSourceExists).toHaveBeenCalledWith(
      args.userId,
      args.sourceId,
    )
  })

  it('should call checkUniqueNameForCreate', async () => {
    await service.update(args, prisma)
    expect(checkUniqueNameForUpdate).toHaveBeenCalledWith(repository, args)
  })

  it('should not call checkUniqueNameForCreate without name', async () => {
    const { name, ...argsWithoutName } = args
    await service.update(argsWithoutName as any, prisma)
    expect(checkUniqueNameForUpdate).not.toHaveBeenCalled()
  })

  it('should call repository.update with correct data', async () => {
    await service.update(args, prisma)
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
    await service.update(args, prisma)
    expect(updateStreamService.updateStreams).toHaveBeenCalledWith(
      prisma,
      args.id,
      args.userId,
      args.streams,
    )
  })

  it('should call buildUpdateData witch correct result', () => {
    const data = service['buildUpdateData'](args)
    expect(data).toEqual({
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
    })
  })
})
