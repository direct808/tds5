import { Injectable } from '@nestjs/common'
import { AffiliateNetworkRepository } from './affiliate-network.repository'
import { AffiliateNetwork } from './affiliate-network.entity'
import {
  checkEntityExists,
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
} from '../utils'

type CreateArgs = {
  name: string
  params?: string
  userId: string
}

type UpdatedArgs = {
  id: string
  userId: string
  name: string
  params?: string
}

type DeleteArgs = {
  id: string
  userId: string
}

@Injectable()
export class AffiliateNetworkService {
  constructor(private readonly repository: AffiliateNetworkRepository) {}

  public async create(args: CreateArgs): Promise<void> {
    await checkUniqueNameForCreate(this.repository, args)

    await this.repository.create(args)
  }

  public async update(args: UpdatedArgs): Promise<void> {
    await checkEntityExists(this.repository, args)

    if (args.name) {
      await checkUniqueNameForUpdate(this.repository, args)
    }

    await this.repository.update(args)
  }

  public async getList(userId: string): Promise<AffiliateNetwork[]> {
    return this.repository.getListByUserId(userId)
  }

  public async delete(args: DeleteArgs): Promise<void> {
    await checkEntityExists(this.repository, args)

    await this.repository.delete(args.id)
  }
}
