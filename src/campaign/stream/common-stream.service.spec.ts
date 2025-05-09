import { Test, TestingModule } from '@nestjs/testing'
import { CommonStreamService } from './common-stream.service'
import { CampaignRepository } from '../campaign.repository'
import { ensureEntityExists } from '../../utils'
import { CreateStreamDto } from '../dto'
import {
  CampaignStreamSchema,
  StreamActionType,
  StreamRedirectType,
} from '../entity'

jest.mock('../../utils')

describe('CommonStreamService', () => {
  let service: CommonStreamService

  const repository = {
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonStreamService,

        {
          provide: CampaignRepository,
          useValue: repository,
        },
      ],
    }).compile()

    service = module.get(CommonStreamService)

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

  it('should be called buildData with correct result', async () => {
    const input: CreateStreamDto = {
      name: 'name',
      schema: CampaignStreamSchema.ACTION,
      redirectType: StreamRedirectType.CURL,
      redirectUrl: '/',
      actionType: StreamActionType.TO_CAMPAIGN,
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
