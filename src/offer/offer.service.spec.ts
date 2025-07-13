import { Test, TestingModule } from '@nestjs/testing'
import { OfferService } from './offer.service.js'
import { OfferRepository } from './offer.repository.js'
import { Offer } from './offer.entity.js'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '../utils/repository-utils.js'
import { AffiliateNetworkRepository } from '../affiliate-network/affiliate-network.repository.js'

jest.mock('../utils/repository-utils')

describe('OfferService', () => {
  let service: OfferService
  let repository: jest.Mocked<OfferRepository>
  let networkRepository: AffiliateNetworkRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        {
          provide: OfferRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getListByUserId: jest.fn(),
          },
        },
        {
          provide: AffiliateNetworkRepository,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<OfferService>(OfferService)
    repository = module.get<jest.Mocked<OfferRepository>>(OfferRepository)
    networkRepository = module.get<AffiliateNetworkRepository>(
      AffiliateNetworkRepository,
    )

    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create an offer', async () => {
      const args = {
        name: 'Test Offer',
        affiliateNetworkId: 'net1',
        userId: 'user1',
        url: 'http://localhost',
      }

      service['ensureNetworkExists'] = jest.fn()

      await service.create(args)

      expect(checkUniqueNameForCreate).toHaveBeenCalledWith(repository, args)
      expect(service['ensureNetworkExists']).toHaveBeenCalledWith(args)
      expect(repository.create).toHaveBeenCalledWith(args)
    })
  })

  describe('update', () => {
    it('should update an offer', async () => {
      const args = {
        id: 'offer1',
        name: 'Updated Offer',
        affiliateNetworkId: 'net1',
        userId: 'user1',
      }

      service['ensureNetworkExists'] = jest.fn()

      await service.update(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, args)
      expect(checkUniqueNameForUpdate).toHaveBeenCalledWith(repository, args)
      expect(service['ensureNetworkExists']).toHaveBeenCalledWith(args)
      expect(repository.update).toHaveBeenCalledWith(args.id, args)
    })

    it('checkUniqueNameForUpdate should not be called', async () => {
      const args = {
        id: 'offer1',
        affiliateNetworkId: 'net1',
        userId: 'user1',
      }

      service['ensureNetworkExists'] = jest.fn()

      await service.update(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, args)
      expect(checkUniqueNameForUpdate).not.toHaveBeenCalled()
      expect(service['ensureNetworkExists']).toHaveBeenCalledWith(args)
      expect(repository.update).toHaveBeenCalledWith(args.id, args)
    })
  })

  describe('getList', () => {
    it('should return a list of offers', async () => {
      const userId = 'user1'
      const offers = [{ id: 'offer1' }]

      repository.getListByUserId.mockResolvedValue(offers as Offer[])

      const result = await service.getList(userId)

      expect(result).toEqual(offers)
      expect(repository.getListByUserId).toHaveBeenCalledWith(userId)
    })
  })

  describe('delete', () => {
    it('should delete an offer', async () => {
      const args = { id: 'offer1', userId: 'user1' }

      await service.delete(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, args)
      expect(repository.delete).toHaveBeenCalledWith(args.id)
    })
  })

  describe('ensureNetworkExists', () => {
    it('should do nothing if affiliateNetworkId is missing', async () => {
      const args = { userId: 'user1' }
      await service['ensureNetworkExists'](args)
      expect(ensureEntityExists).not.toHaveBeenCalled()
    })

    it('should call ensureEntityExists if affiliateNetworkId exists', async () => {
      const args = { affiliateNetworkId: 'net1', userId: 'user1' }

      await service['ensureNetworkExists'](args)

      expect(ensureEntityExists).toHaveBeenCalledWith(
        networkRepository,
        {
          id: args.affiliateNetworkId,
          userId: args.userId,
        },
        'Affiliate Network not found',
      )
    })
  })
})
