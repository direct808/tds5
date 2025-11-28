import { Test, TestingModule } from '@nestjs/testing'
import { CommonStreamService } from './common-stream.service'
import { CreateStreamService } from './create-stream.service'
import { StreamRepository } from './stream.repository'
import { CreateStreamOfferService } from '../stream-offer/create-stream-offer.service'
import { CreateStreamDto } from '../dto/create-stream.dto'
import {
  PrismaClient,
  StreamSchemaEnum,
} from '../../../../generated/prisma/client'

describe('CreateStreamService', () => {
  let service: CreateStreamService

  const commonService = {
    ensureCampaignExists: jest.fn(),
    buildData: jest.fn(),
  }

  const repository = {
    create: jest.fn(),
  }

  const createStreamOfferService = {
    createStreamOffers: jest.fn(),
  }

  const prisma = {} as PrismaClient

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStreamService,
        {
          provide: CommonStreamService,
          useValue: commonService,
        },
        {
          provide: StreamRepository,
          useValue: repository,
        },
        {
          provide: CreateStreamOfferService,
          useValue: createStreamOfferService,
        },
      ],
    }).compile()

    service = module.get(CreateStreamService)

    jest.clearAllMocks()
  })

  describe('createStreams', () => {
    it('should be called createStream 3 times', async () => {
      const spy = jest
        .spyOn(service, 'createStream')
        .mockReturnValue(Promise.resolve())
      await service.createStreams(prisma, 'campaign-id', 'user-id', [
        {} as CreateStreamDto,
        {} as CreateStreamDto,
        {} as CreateStreamDto,
      ])
      expect(spy).toHaveBeenCalledTimes(3)
    })
  })

  describe('createStream', () => {
    it('Check createStream', async () => {
      const input = {
        actionCampaignId: 'action-campaign-id',
      } as CreateStreamDto

      const buildData = {}

      commonService.buildData.mockReturnValue(buildData)

      jest
        .spyOn(service as any, 'createStreamOffers')
        .mockReturnValue(Promise.resolve())

      repository.create.mockReturnValue({ id: 'stream-id' })
      await service.createStream(prisma, 'campaign-id', 'user-id', input)

      expect(commonService.ensureCampaignExists).toHaveBeenCalledWith(
        'user-id',
        'action-campaign-id',
      )
      expect(commonService.buildData).toHaveBeenCalledWith(input, 'campaign-id')
      expect(repository.create).toHaveBeenCalledWith(prisma, buildData)
      expect(service['createStreamOffers']).toHaveBeenCalledWith(
        prisma,
        input,
        'stream-id',
        'user-id',
      )
    })
  })

  describe('createStreamOffers', () => {
    it('Should not be called createStreamOffers if schema is not LANDINGS_OFFERS', async () => {
      await service['createStreamOffers'](
        prisma,
        {} as CreateStreamDto,
        'stream-id',
        'user-id',
      )
      expect(createStreamOfferService.createStreamOffers).not.toHaveBeenCalled()
    })

    it('Should be called createStreamOffers if schema is LANDINGS_OFFERS', async () => {
      const input: CreateStreamDto = {
        name: 'name-1',
        schema: StreamSchemaEnum.LANDINGS_OFFERS,
        offers: [{ offerId: 'offer-id', active: true, percent: 100 }],
      }
      await service['createStreamOffers'](prisma, input, 'stream-id', 'user-id')
      expect(createStreamOfferService.createStreamOffers).toHaveBeenCalled()
    })
  })
})
