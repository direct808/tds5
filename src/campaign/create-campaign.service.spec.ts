import { Test, TestingModule } from '@nestjs/testing'
import { CreateCampaignService } from './create-campaign.service'
import { CampaignRepository } from './campaign.repository'
import { CommonCampaignService } from './common-campaign.service'
import { DataSource, EntityManager } from 'typeorm'
import { CreateStreamService } from './stream'
import { checkUniqueNameForCreate } from '../utils/repository-utils'

jest.mock('../utils/repository-utils')

const args = {
  name: 'test',
  sourceId: 'source-123',
  active: true,
  userId: 'user-1',
  streams: [],
}

describe('CreateCampaignService', () => {
  let service: CreateCampaignService
  const dataSource = {
    transaction: jest.fn().mockImplementation((cb) => cb(manager)),
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
  const manager = {} as EntityManager

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignService,
        {
          provide: DataSource,
          useValue: dataSource,
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
    expect(dataSource.transaction).toHaveBeenCalled()
  })

  it('should not use transaction when manager is provided', async () => {
    await service.create(args, manager)
    expect(dataSource.transaction).not.toHaveBeenCalled()
  })

  it('should call ensureSourceExists', async () => {
    await service.create(args, manager)
    expect(commonCampaignService.ensureSourceExists).toHaveBeenCalledWith(
      args.userId,
      args.sourceId,
    )
  })

  it('should call checkUniqueNameForCreate', async () => {
    await service.create(args, manager)
    expect(checkUniqueNameForCreate).toHaveBeenCalledWith(repository, args)
  })

  it('should call repository.create with correct data', async () => {
    await service.create(args, manager)
    expect(repository.create).toHaveBeenCalledWith(
      manager,
      expect.objectContaining({
        name: args.name,
        sourceId: args.sourceId,
        active: args.active,
        userId: args.userId,
      }),
    )
  })

  it('should call createStreamService.createStreams with correct params', async () => {
    await service.create(args, manager)
    expect(createStreamService.createStreams).toHaveBeenCalledWith(
      manager,
      'campaign-1',
      args.userId,
      args.streams,
    )
  })

  it('should call buildCreateData witch correct result', async () => {
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
