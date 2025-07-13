import { Test, TestingModule } from '@nestjs/testing'
import { CommonStreamService } from './common-stream.service.js'
import { CreateStreamService } from './create-stream.service.js'
import { StreamRepository } from './stream.repository.js'
import { EntityManager } from 'typeorm'
import { UpdateStreamService } from './update-stream.service.js'
import { getIdsForDelete } from '../../utils/repository-utils.js'
import { UpdateStreamOfferService } from '../stream-offer/update-stream-offer.service.js'
import { CampaignStreamSchema } from '../entity/stream.entity.js'
import { UpdateStreamDto } from '../dto/update-stream.dto.js'

jest.mock('../../utils/repository-utils')

describe('UpdateStreamService', () => {
  let service: UpdateStreamService

  const commonService = {
    ensureCampaignExists: jest.fn(),
    buildData: jest.fn(),
  }

  const repository = {
    update: jest.fn(),
    delete: jest.fn(),
    getByIdsAndCampaignId: jest.fn(),
    getByCampaignId: jest.fn(),
  }

  const updateStreamOfferService = {
    updateStreamOffers: jest.fn(),
  }

  const createStreamService = {
    createStream: jest.fn(),
  }

  const manager = {} as EntityManager

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStreamService,
        {
          provide: CommonStreamService,
          useValue: commonService,
        },
        {
          provide: StreamRepository,
          useValue: repository,
        },
        {
          provide: UpdateStreamOfferService,
          useValue: updateStreamOfferService,
        },
        {
          provide: CreateStreamService,
          useValue: createStreamService,
        },
      ],
    }).compile()

    service = module.get(UpdateStreamService)

    jest.clearAllMocks()
  })

  it('Check updateStreams', async () => {
    const streams: UpdateStreamDto[] = [
      {
        id: 'stream-id',
        name: 'Name',
        schema: CampaignStreamSchema.ACTION,
      },
    ]
    const ensureStreamExists = jest
      .spyOn(service as any, 'ensureStreamExists')
      .mockReturnValue(Promise.resolve())
    //
    const deleteOldStreams = jest
      .spyOn(service as any, 'deleteOldStreams')
      .mockReturnValue(Promise.resolve())

    const processStream = jest
      .spyOn(service as any, 'processStream')
      .mockReturnValue(Promise.resolve())

    await service.updateStreams(manager, 'campaign-id', 'user-id', streams)

    expect(ensureStreamExists).toHaveBeenCalledWith(
      manager,
      streams,
      'campaign-id',
    )

    expect(deleteOldStreams).toHaveBeenCalledWith(
      manager,
      streams,
      'campaign-id',
    )

    expect(processStream).toHaveBeenCalledTimes(streams.length)
  })

  describe('processStream', () => {
    let checkCampaignSelfReferencing: jest.SpyInstance
    let updateStream: jest.SpyInstance

    beforeEach(async () => {
      checkCampaignSelfReferencing = jest
        .spyOn(service as any, 'checkCampaignSelfReferencing')
        .mockReturnValue({})

      updateStream = jest
        .spyOn(service as any, 'updateStream')
        .mockReturnValue({})
    })

    it('Check processStream with id', async () => {
      const stream: UpdateStreamDto = {
        id: 'stream-id',
        name: 'Name',
        schema: CampaignStreamSchema.ACTION,
        actionCampaignId: 'actionCampaignId',
      }

      await service['processStream'](manager, 'campaign-id', 'user-id', stream)

      expect(checkCampaignSelfReferencing).toHaveBeenCalledWith(
        'campaign-id',
        stream.actionCampaignId,
      )

      expect(updateStream).toHaveBeenCalledWith(
        manager,
        'campaign-id',
        'user-id',
        stream,
        stream.id,
      )

      expect(createStreamService.createStream).not.toHaveBeenCalled()
    })

    it('Check processStream without id', async () => {
      const stream: UpdateStreamDto = {
        name: 'Name',
        schema: CampaignStreamSchema.ACTION,
        actionCampaignId: 'actionCampaignId',
      }

      await service['processStream'](manager, 'campaign-id', 'user-id', stream)

      expect(checkCampaignSelfReferencing).toHaveBeenCalledWith(
        'campaign-id',
        stream.actionCampaignId,
      )

      expect(updateStream).not.toHaveBeenCalled()

      expect(createStreamService.createStream).toHaveBeenCalledWith(
        manager,
        'campaign-id',
        'user-id',
        stream,
      )
    })
  })

  it('check updateStream', async () => {
    const data = { val: 'Val' }
    commonService.buildData.mockReturnValue(data)
    const stream = {
      id: 'stream-id',
      name: 'Name',
      schema: CampaignStreamSchema.ACTION,
      actionCampaignId: 'actionCampaignId',
    }

    const updateStreamOffers = jest
      .spyOn(service as any, 'updateStreamOffers')
      .mockReturnValue({})

    await service['updateStream'](
      manager,
      'campaign-id',
      'user-id',
      stream,
      stream.id,
    )

    expect(commonService.ensureCampaignExists).toHaveBeenCalledWith(
      'user-id',
      stream.actionCampaignId,
    )

    expect(commonService.buildData).toHaveBeenCalledWith(stream, 'campaign-id')
    expect(repository.update).toHaveBeenCalledWith(manager, stream.id, data)
    expect(updateStreamOffers).toHaveBeenCalledWith(
      manager,
      stream,
      stream.id,
      'user-id',
    )
  })

  describe('checkCampaignSelfReferencing', () => {
    it('should be throw error', async () => {
      expect(() =>
        service['checkCampaignSelfReferencing']('id-1', 'id-1'),
      ).toThrow('Company should not refer to itself')
    })

    it('should not be throw error', async () => {
      expect(() =>
        service['checkCampaignSelfReferencing']('id-1', 'id-2'),
      ).not.toThrow()
    })
  })

  describe('updateStreamOffers', () => {
    it('should not be called updateStreamOffers if no offers', async () => {
      const stream = {
        id: 'stream-id',
        name: 'Name',
        schema: CampaignStreamSchema.LANDINGS_OFFERS,
      }
      await service['updateStreamOffers'](manager, stream, stream.id, 'user-id')
      expect(updateStreamOfferService.updateStreamOffers).not.toHaveBeenCalled()
    })

    it('should not be called updateStreamOffers if offers.length=0', async () => {
      const stream = {
        id: 'stream-id',
        name: 'Name',
        schema: CampaignStreamSchema.LANDINGS_OFFERS,
        offers: [],
      }
      await service['updateStreamOffers'](manager, stream, stream.id, 'user-id')
      expect(updateStreamOfferService.updateStreamOffers).not.toHaveBeenCalled()
    })

    it('should not be called updateStreamOffers if schema not LANDINGS_OFFERS', async () => {
      const stream = {
        id: 'stream-id',
        name: 'Name',
        schema: CampaignStreamSchema.ACTION,
        offers: [{ offerId: 'offer-1', percent: 100, active: true }],
      }
      await service['updateStreamOffers'](manager, stream, stream.id, 'user-id')
      expect(updateStreamOfferService.updateStreamOffers).not.toHaveBeenCalled()
    })

    it('should not be called updateStreamOffers if schema is LANDINGS_OFFERS and offers.length>0', async () => {
      const offers = [{ offerId: 'offer-1', percent: 100, active: true }]
      const stream = {
        id: 'stream-id',
        name: 'Name',
        schema: CampaignStreamSchema.LANDINGS_OFFERS,
        offers,
      }
      await service['updateStreamOffers'](manager, stream, stream.id, 'user-id')
      expect(updateStreamOfferService.updateStreamOffers).toHaveBeenCalled()
      expect(updateStreamOfferService.updateStreamOffers).toHaveBeenCalledWith(
        manager,
        'stream-id',
        'user-id',
        offers,
      )
    })
  })

  describe('deleteOldStreams', () => {
    it('should not be called repository.delete if no ids', async () => {
      const getIdsForDelete = jest
        .spyOn(service as any, 'getIdsForDelete')
        .mockReturnValue([])
      await service['deleteOldStreams'](manager, [], 'campaign-id')

      expect(getIdsForDelete).toHaveBeenCalledWith(manager, [], 'campaign-id')
      expect(repository.delete).not.toHaveBeenCalled()
    })

    it('should not be called repository.delete if ids.length>0', async () => {
      const getIdsForDelete = jest
        .spyOn(service as any, 'getIdsForDelete')
        .mockReturnValue(['1'])
      await service['deleteOldStreams'](manager, [], 'campaign-id')

      expect(getIdsForDelete).toHaveBeenCalledWith(manager, [], 'campaign-id')
      expect(repository.delete).toHaveBeenCalled()
    })
  })

  describe('ensureStreamExists', () => {
    it('should not be error if len equal', async () => {
      repository.getByIdsAndCampaignId.mockReturnValue([{ id: '1' }])

      const promise = service['ensureStreamExists'](manager, [], 'campaign-id')

      await expect(promise).rejects.toThrow('Some stream ids not found')

      expect(repository.getByIdsAndCampaignId).toHaveBeenCalledWith(
        manager,
        [],
        'campaign-id',
      )
    })

    it('should be error if len not equal', async () => {
      repository.getByIdsAndCampaignId.mockReturnValue([{ id: '1' }])

      const promise = service['ensureStreamExists'](
        manager,
        [{ id: '1' }],
        'campaign-id',
      )

      await expect(promise).resolves.not.toThrow()

      expect(repository.getByIdsAndCampaignId).toHaveBeenCalledWith(
        manager,
        ['1'],
        'campaign-id',
      )
    })
  })

  describe('getIdsForDelete', () => {
    it('check getIdsForDelete', async () => {
      const existsStreams = { id: 'id-1' }
      const retValue = ['id-1']
      repository.getByCampaignId.mockReturnValue(existsStreams)
      ;(getIdsForDelete as any).mockReturnValue(retValue)

      const value = await service['getIdsForDelete'](manager, [], 'campaign-id')

      expect(repository.getByCampaignId).toHaveBeenCalledWith(
        manager,
        'campaign-id',
      )

      expect(getIdsForDelete).toHaveBeenCalledWith(existsStreams, [])
      expect(retValue).toEqual(value)
    })
  })
})
