import { CampaignRepository } from './campaign.repository.js'
import { DataSource, EntityManager } from 'typeorm'
import { UpdateStreamService } from './stream/update-stream.service.js'
import { Test, TestingModule } from '@nestjs/testing'
import { checkUniqueNameForUpdate } from '@/utils/repository-utils.js'
import { UpdateCampaignService } from './update-campaign.service.js'
import { CommonCampaignService } from './common-campaign.service.js'

jest.mock('../utils/repository-utils')

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
  const dataSource = {
    transaction: jest.fn().mockImplementation((cb) => cb(manager)),
  }
  const repository = {
    update: jest.fn(),
  }
  const updateStreamService = {
    updateStreams: jest.fn(),
  }
  const commonCampaignService = {
    ensureSourceExists: jest.fn(),
  }
  const manager = {} as EntityManager

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCampaignService,
        {
          provide: DataSource,
          useValue: dataSource,
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
    expect(dataSource.transaction).toHaveBeenCalled()
  })

  it('should not use transaction when manager is provided', async () => {
    await service.update(args, manager)
    expect(dataSource.transaction).not.toHaveBeenCalled()
  })

  it('should call ensureSourceExists', async () => {
    await service.update(args, manager)
    expect(commonCampaignService.ensureSourceExists).toHaveBeenCalledWith(
      args.userId,
      args.sourceId,
    )
  })

  it('should call checkUniqueNameForCreate', async () => {
    await service.update(args, manager)
    expect(checkUniqueNameForUpdate).toHaveBeenCalledWith(repository, args)
  })

  it('should not call checkUniqueNameForCreate without name', async () => {
    const { name, ...argsWithoutName } = args
    await service.update(argsWithoutName as any, manager)
    expect(checkUniqueNameForUpdate).not.toHaveBeenCalled()
  })

  it('should call repository.update with correct data', async () => {
    await service.update(args, manager)
    expect(repository.update).toHaveBeenCalledWith(
      manager,
      args.id,
      expect.objectContaining({
        name: args.name,
        sourceId: args.sourceId,
        active: args.active,
      }),
    )
  })

  it('should call updateStreams with correct params', async () => {
    await service.update(args, manager)
    expect(updateStreamService.updateStreams).toHaveBeenCalledWith(
      manager,
      args.id,
      args.userId,
      args.streams,
    )
  })

  it('should call buildUpdateData witch correct result', async () => {
    const data = service['buildUpdateData'](args)
    expect(data).toEqual({
      name: args.name,
      sourceId: args.sourceId,
      active: args.active,
    })
  })
})
