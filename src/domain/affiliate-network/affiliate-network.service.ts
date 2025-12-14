import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  affiliateNetworkEventName,
  AffiliateNetworkUpdatedEvent,
} from '@/domain/affiliate-network/events/affiliate-network-updated.event'
import { AffiliateNetworkRepository } from '@/infra/repositories/affiliate-network.repository'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '@/infra/repositories/utils/repository-utils'
import { AffiliateNetworkModel } from '@generated/prisma/models/AffiliateNetwork'

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
  id: string
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
    await ensureEntityExists(this.repository, args)

    if (args.name) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.repository.update(args.id, args)

    this.eventEmitter.emit(
      affiliateNetworkEventName,
      new AffiliateNetworkUpdatedEvent(args.id),
    )
  }

  public async getList(userId: string): Promise<AffiliateNetworkModel[]> {
    return this.repository.getListByUserId(userId)
  }

  public async delete(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.delete(args.id)
  }

  public async getByIdAndUserIdOrFail(
    id: string,
    userId: string,
  ): Promise<AffiliateNetworkModel> {
    const result = await this.repository.getByIdAndUserId({ id, userId })

    if (!result) {
      throw new Error('No result')
    }

    return result
  }
}
