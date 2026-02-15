import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  affiliateNetworkUpdatedEventName,
  AffiliateNetworkUpdatedEvent,
} from './events/affiliate-network-updated.event'
import { AffiliateNetworkRepository } from '../../infra/repositories/affiliate-network.repository'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '@/infra/repositories/utils/repository-utils'
import { AffiliateNetworkModel } from '@generated/prisma/models/AffiliateNetwork'
import {
  AffiliateNetworkSoftDeletedEvent,
  affiliateNetworkSoftDeletedName,
} from '@/domain/affiliate-network/events/affiliate-network-soft-deleted.event'

type CreateArgs = {
  name: string
  offerParams: string | null
  userId: string
}

type UpdatedArgs = {
  id: string
  userId: string
  name?: string
  offerParams?: string
}

type DeleteArgs = {
  ids: string[]
  userId: string
}

@Injectable()
export class AffiliateNetworkService {
  constructor(
    private readonly repository: AffiliateNetworkRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async create(args: CreateArgs): Promise<AffiliateNetworkModel> {
    await checkUniqueNameForCreate(this.repository, args)

    const id = await this.repository.create(args)

    return this.getByIdAndUserIdOrFail(id, args.userId)
  }

  public async update(args: UpdatedArgs): Promise<void> {
    await ensureEntityExists(this.repository, {
      ids: [args.id],
      userId: args.userId,
    })

    if (args.name !== undefined) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.repository.update(args.id, args)

    this.eventEmitter.emit(
      affiliateNetworkUpdatedEventName,
      new AffiliateNetworkUpdatedEvent(args.id),
    )
  }

  public async getList(userId: string): Promise<AffiliateNetworkModel[]> {
    return this.repository.getListByUserId(userId)
  }

  public async deleteMany(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.softDeleteMany(args.ids)

    this.eventEmitter.emit(
      affiliateNetworkSoftDeletedName,
      new AffiliateNetworkSoftDeletedEvent(args.ids),
    )
  }

  public async getByIdAndUserIdOrFail(
    id: string,
    userId: string,
  ): Promise<AffiliateNetworkModel> {
    const [result] = await this.repository.getByIdsAndUserId({
      ids: [id],
      userId,
    })

    if (!result) {
      throw new Error('No result')
    }

    return result
  }
}
