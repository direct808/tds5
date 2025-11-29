import { Test, TestingModule } from '@nestjs/testing'
import { CommonStreamOfferService } from './common-stream-offer.service'
import { StreamOfferRepository } from '@/infra/repositories/stream-offer.repository'
import { UpdateStreamOfferService } from './update-stream-offer.service'
import { getIdsForDelete } from '@/infra/repositories/utils/repository-utils'
import { PrismaClient } from '../../../../generated/prisma/client'
import { StreamOfferUncheckedCreateInput } from '../../../../generated/prisma/models/StreamOffer'
import { Transaction } from '@/infra/prisma/prisma-transaction'

jest.mock('@/infra/repositories/utils/repository-utils')

describe('CommonStreamService', () => {
  let service: UpdateStreamOfferService

  const streamOfferRepository = {
    getByStreamId: jest.fn(),
    saveMany: jest.fn(),
    delete: jest.fn(),
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
        UpdateStreamOfferService,
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

    service = module.get(UpdateStreamOfferService)

    jest.clearAllMocks()
  })

  it('check updateStreamOffers', async () => {
    const input = [{ id: 'id', offerId: 'offer-id', active: true, percent: 75 }]

    const prepareInput = jest
      .spyOn(service as any, 'prepareInput')
      .mockReturnValue(undefined)

    const buildSaveData = jest
      .spyOn(service as any, 'buildSaveData')
      .mockReturnValue([])

    const saveStreamOffers = jest
      .spyOn(service as any, 'saveStreamOffers')
      .mockReturnValue([])

    await service.updateStreamOffers(transaction, 'stream-id', 'user-id', input)

    expect(prepareInput).toHaveBeenCalledWith(
      prisma,
      'stream-id',
      'user-id',
      input,
    )
    expect(buildSaveData).toHaveBeenCalledWith('stream-id', input)
    expect(saveStreamOffers).toHaveBeenCalledWith(prisma, [])
  })

  it('check prepareInput', async () => {
    const input = [{ id: 'id', offerId: 'offer-id', active: true, percent: 75 }]

    const deleteOldStreamOffers = jest
      .spyOn(service as any, 'deleteOldStreamOffers')
      .mockReturnValue(undefined)

    commonService.buildCreateData.mockReturnValue([])

    await service['prepareInput'](transaction, 'stream-id', 'user-id', input)

    expect(deleteOldStreamOffers).toHaveBeenCalledWith(
      prisma,
      input,
      'stream-id',
    )
    expect(commonService.checkPercentSum).toHaveBeenCalledWith(input)
    expect(commonService.checkForRepeatOffers).toHaveBeenCalledWith(input)
    expect(commonService.ensureOffersExists).toHaveBeenCalledWith(
      input,
      'user-id',
    )
  })

  it('check buildSaveData', () => {
    const buildUpdateData = jest
      .spyOn(service as any, 'buildUpdateData')
      .mockReturnValue(['buildUpdateData'])

    commonService.buildCreateData.mockReturnValue(['buildCreateData'])

    const result = service['buildSaveData']('stream-id', [
      { id: 'id' } as any,
      { percent: 75 } as any,
    ])

    expect(result).toEqual(['buildCreateData', 'buildUpdateData'])
    expect(commonService.buildCreateData).toHaveBeenCalledWith('stream-id', [
      { percent: 75 },
    ])
    expect(buildUpdateData).toHaveBeenCalledWith('stream-id', [{ id: 'id' }])
  })

  describe('saveStreamOffers', () => {
    it('should not be call saveMany if length=0', async () => {
      await service['saveStreamOffers'](transaction, [])
      expect(streamOfferRepository.saveMany).not.toHaveBeenCalled()
    })

    it('should be call saveMany if length>0', async () => {
      await service['saveStreamOffers'](transaction, [
        { percent: 75 } as StreamOfferUncheckedCreateInput,
      ])
      expect(streamOfferRepository.saveMany).toHaveBeenCalledWith(prisma, [
        { percent: 75 },
      ])
    })
  })

  describe('deleteOldStreamOffers', () => {
    it('should not called delete if length=0', async () => {
      const getIdsForDelete = jest
        .spyOn(service as any, 'getIdsForDelete')
        .mockReturnValue([])

      await service['deleteOldStreamOffers'](transaction, [], 'stream-id')
      expect(getIdsForDelete).toHaveBeenCalledWith(prisma, [], 'stream-id')
      expect(streamOfferRepository.delete).not.toHaveBeenCalled()
    })

    it('should called delete if length>0', async () => {
      const getIdsForDelete = jest
        .spyOn(service as any, 'getIdsForDelete')
        .mockReturnValue([{}])

      await service['deleteOldStreamOffers'](transaction, [], 'stream-id')
      expect(getIdsForDelete).toHaveBeenCalledWith(prisma, [], 'stream-id')
      expect(streamOfferRepository.delete).toHaveBeenCalledWith(prisma, [{}])
    })
  })

  it('check buildUpdateData', () => {
    const result = service['buildUpdateData']('stream-id', [
      { percent: 50, active: true, offerId: 'offer-id', id: 'id' },
    ])
    expect(result).toEqual([
      {
        percent: 50,
        active: true,
        offerId: 'offer-id',
        id: 'id',
        streamId: 'stream-id',
      },
    ])
  })

  it('check getIdsForDelete', async () => {
    streamOfferRepository.getByStreamId.mockReturnValue([])
    ;(getIdsForDelete as any).mockReturnValue([])
    const result = await service['getIdsForDelete'](
      transaction,
      [],
      'stream-id',
    )

    expect(streamOfferRepository.getByStreamId).toHaveBeenCalledWith(
      prisma,
      'stream-id',
    )
    expect(getIdsForDelete).toHaveBeenCalledWith([], [])
    expect(result).toEqual([])
  })
})
