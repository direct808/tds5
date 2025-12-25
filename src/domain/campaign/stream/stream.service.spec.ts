import { Test, TestingModule } from '@nestjs/testing'
import { StreamService } from './stream.service'
import { CreateStreamDto } from '../dto/create-stream.dto'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'
import {
  StreamActionTypeEnum,
  StreamRedirectTypeEnum,
  StreamSchemaEnum,
} from '@generated/prisma/enums'

jest.mock('@/infra/repositories/utils/repository-utils')

describe('StreamService', () => {
  let service: StreamService

  const repository = {
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamService,

        {
          provide: CampaignRepository,
          useValue: repository,
        },
      ],
    }).compile()

    service = module.get(StreamService)

    jest.clearAllMocks()
  })

  it('should not be called ensureEntityExists if campaignId not provided', async () => {
    await service.ensureCampaignExists('user-id')
    expect(ensureEntityExists).not.toHaveBeenCalled()
  })

  it('should be called ensureEntityExists if campaignId provided', async () => {
    await service.ensureCampaignExists('user-id', 'campaign-id')
    expect(ensureEntityExists).toHaveBeenCalledWith(
      repository,
      {
        userId: 'user-id',
        id: 'campaign-id',
      },
      'actionCampaignId not found',
    )
  })

  it('should be called buildData with correct result', () => {
    const input: CreateStreamDto = {
      name: 'name',
      schema: StreamSchemaEnum.ACTION,
      redirectType: StreamRedirectTypeEnum.CURL,
      redirectUrl: '/',
      actionType: StreamActionTypeEnum.TO_CAMPAIGN,
      actionCampaignId: 'actionCampaignId',
      actionContent: 'actionContent',
    }
    const res = service.buildData(input, 'campaign-id')
    expect(res).toEqual({
      name: input.name,
      campaignId: 'campaign-id',
      schema: input.schema,
      redirectType: input.redirectType,
      redirectUrl: input.redirectUrl,
      actionType: input.actionType,
      actionCampaignId: input.actionCampaignId,
      actionContent: input.actionContent,
    })
  })
})
