import { Test, TestingModule } from '@nestjs/testing'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { CreateStreamOfferService } from './create-stream-offer.service'
import { StreamOfferRepository } from '../../../infra/repositories/stream-offer.repository'
import { PrismaClient } from '@generated/prisma/client'
import { Transaction } from '../../../infra/prisma/prisma-transaction'

describe('CommonStreamService', () => {
  let service: CreateStreamOfferService

  const streamOfferRepository = {
    saveMany: jest.fn(),
  }

  const commonService = {
    checkPercentSum: jest.fn(),
    checkForRepeatOffers: jest.fn(),
    ensureOffersExists: jest.fn(),
    buildCreateData: jest.fn(),
  }

  const prisma = {} as PrismaClient
  const transaction = {} as Transaction

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStreamOfferService,
        {
          provide: StreamOfferRepository,
          useValue: streamOfferRepository,
        },
        {
          provide: CommonStreamOfferService,
          useValue: commonService,
        },
      ],
    }).compile()

    service = module.get(CreateStreamOfferService)

    jest.clearAllMocks()
  })

  it('check createStreamOffers', async () => {
    const data = {}
    commonService.buildCreateData.mockReturnValue(data)
    const input = [{ offerId: 'offer-id', active: true, percent: 75 }]
    await service.createStreamOffers(transaction, 'stream-id', 'user-id', input)

    expect(commonService.checkPercentSum).toHaveBeenCalledWith(input)
    expect(commonService.checkForRepeatOffers).toHaveBeenCalledWith(input)
    expect(commonService.ensureOffersExists).toHaveBeenCalledWith(
      input,
      'user-id',
    )
    expect(commonService.buildCreateData).toHaveBeenCalledWith(
      'stream-id',
      input,
    )
    expect(streamOfferRepository.saveMany).toHaveBeenCalledWith(prisma, data)
  })
})
