import { Injectable } from '@nestjs/common'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '../utils'
import { OfferRepository } from './offer.repository'
import { Offer } from './offer.entity'
import { AffiliateNetworkRepository } from '../affiliate-network'

type CreateArgs = {
  name: string
  userId: string
  url: string
  affiliateNetworkId: string
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
  id: string
  userId: string
}

@Injectable()
export class OfferService {
  constructor(
    private readonly repository: OfferRepository,
    private readonly networkRepository: AffiliateNetworkRepository,
  ) {}

  public async create(args: CreateArgs): Promise<void> {
    await checkUniqueNameForCreate(this.repository, args)

    await this.ensureNetworkExists(args)

    await this.repository.create(args)
  }

  public async update(args: UpdatedArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    if (args.name) {
      await checkUniqueNameForUpdate(this.repository, {
        ...args,
        name: args.name,
      })
    }

    await this.ensureNetworkExists(args)

    await this.repository.update(args.id, args)
  }

  public async getList(userId: string): Promise<Offer[]> {
    return this.repository.getListByUserId(userId)
  }

  public async delete(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.delete(args.id)
  }

  private async ensureNetworkExists(args: EnsureNetworkExistsArgs) {
    if (!args.affiliateNetworkId) {
      return
    }

    await ensureEntityExists(
      this.networkRepository,
      {
        id: args.affiliateNetworkId,
        userId: args.userId,
      },
      'Affiliate Network not found',
    )
  }
}
