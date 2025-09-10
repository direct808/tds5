import { Injectable } from '@nestjs/common'
import { AffiliateNetworkRepository } from './affiliate-network.repository'
import { AffiliateNetwork } from './affiliate-network.entity'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '@/utils/repository-utils'
import {
  OfferUpdatedEvent,
  offerUpdateEventName,
} from '@/offer/events/offer-updated.event'
import { EventEmitter2 } from '@nestjs/event-emitter'

type CreateArgs = {
  name: string
  offerParams?: string
  userId: string
}

type UpdatedArgs = {
  id: string
  userId: string
  name?: string
  offerParams?: string
}

type DeleteArgs = {
  id: string
  userId: string
}

@Injectable()
export class AffiliateNetworkService {
  constructor(
    private readonly repository: AffiliateNetworkRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async create(args: CreateArgs): Promise<AffiliateNetwork> {
    await checkUniqueNameForCreate(this.repository, args)

    const id = await this.repository.create(args)

    return this.getByIdAndUserIdOrFail(id, args.userId)
  }

  public async update(args: UpdatedArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    if (args.name) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.repository.update(args.id, args)

    this.eventEmitter.emit(offerUpdateEventName, new OfferUpdatedEvent(args.id))
  }

  public async getList(userId: string): Promise<AffiliateNetwork[]> {
    return this.repository.getListByUserId(userId)
  }

  public async delete(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.delete(args.id)
  }

  public async getByIdAndUserIdOrFail(
    id: string,
    userId: string,
  ): Promise<AffiliateNetwork> {
    const result = await this.repository.getByIdAndUserId({ id, userId })

    if (!result) {
      throw new Error('No result')
    }

    return result
  }
}
