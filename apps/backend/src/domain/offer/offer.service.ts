import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  OfferUpdatedEvent,
  offerUpdateEventName,
} from './events/offer-updated.event'
import { OfferRepository } from '../../infra/repositories/offer.repository'
import { AffiliateNetworkRepository } from '../../infra/repositories/affiliate-network.repository'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '@/infra/repositories/utils/repository-utils'
import { OfferModel } from '@generated/prisma/models/Offer'
import { isNullable } from '@/shared/helpers'
import {
  OfferSoftDeletedEvent,
  offerSoftDeletedEventName,
} from '@/domain/offer/events/offer-soft-deleted.event'

type CreateArgs = {
  name: string
  userId: string
  url: string
  affiliateNetworkId?: string
}

type UpdatedArgs = {
  name?: string
  affiliateNetworkId?: string
  id: string
  userId: string
}

type EnsureNetworkExistsArgs = {
  affiliateNetworkId?: string
  userId: string
}

type DeleteArgs = {
  ids: string[]
  userId: string
}

@Injectable()
export class OfferService {
  constructor(
    private readonly repository: OfferRepository,
    private readonly networkRepository: AffiliateNetworkRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create offer
   * @param args
   */
  public async create(args: CreateArgs): Promise<void> {
    await checkUniqueNameForCreate(this.repository, args)

    await this.ensureNetworkExists(args)

    await this.repository.create(args)
  }

  /**
   * Update offer
   * @param args
   */
  public async update(args: UpdatedArgs): Promise<void> {
    await ensureEntityExists(this.repository, {
      ids: [args.id],
      userId: args.userId,
    })

    if (!isNullable(args.name)) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.ensureNetworkExists(args)

    await this.repository.update(args.id, args)

    this.eventEmitter.emit(offerUpdateEventName, new OfferUpdatedEvent(args.id))
  }

  /**
   * List offer
   * @param userId
   */
  public async getList(userId: string): Promise<OfferModel[]> {
    return this.repository.getListByUserId(userId)
  }

  /**
   * Delete offer
   * @param args
   */
  public async softDeleteMany(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.softDeleteMany(args.ids)

    this.eventEmitter.emit(
      offerSoftDeletedEventName,
      new OfferSoftDeletedEvent(args.ids),
    )
  }

  /**
   * Check exists Affiliate Network for user.
   * If `affiliateNetworkId` is missing, the method does nothing.
   * @param args Data for verification
   */
  private async ensureNetworkExists(
    args: EnsureNetworkExistsArgs,
  ): Promise<void> {
    if (isNullable(args.affiliateNetworkId)) {
      return
    }

    await ensureEntityExists(
      this.networkRepository,
      {
        ids: [args.affiliateNetworkId],
        userId: args.userId,
      },
      'Affiliate Network not found',
    )
  }
}
