import { Injectable } from '@nestjs/common'
import { AffiliateNetworkRepository } from './affiliate-network.repository.js'
import { AffiliateNetwork } from './affiliate-network.entity.js'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '@/utils/repository-utils.js'

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
  constructor(private readonly repository: AffiliateNetworkRepository) {}

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
