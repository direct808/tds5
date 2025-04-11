import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { AffiliateNetworkRepository } from './affiliate-network.repository'
import { AffiliateNetwork } from './affiliate-network.entity'

type CreateArgs = {
  name: string
  params?: string
  userId: string
}

type UpdatedArgs = {
  name: string
  params?: string
}

@Injectable()
export class AffiliateNetworkService {
  constructor(private readonly repository: AffiliateNetworkRepository) {}

  public async create(args: CreateArgs): Promise<void> {
    const existsAffiliateNetwork = await this.repository.getByName(
      args.name,
      args.userId,
    )

    if (existsAffiliateNetwork) {
      throw new ConflictException(
        'Партнерская сеть с таким именем уже существует',
      )
    }

    await this.repository.create(args)
  }

  public async update(
    id: string,
    userId: string,
    args: UpdatedArgs,
  ): Promise<void> {
    const source = await this.repository.getById(id, userId)

    if (!source) {
      throw new NotFoundException()
    }

    if (args.name) {
      const existing = await this.repository.getByNameAndUserId(
        args.name,
        userId,
      )
      if (existing && existing.id !== id) {
        throw new ConflictException('Name must be unique')
      }
    }

    await this.repository.update(id, args)
  }

  public async getList(userId: string): Promise<AffiliateNetwork[]> {
    return this.repository.getListByUserId(userId)
  }

  public async delete(id: string, userId: string): Promise<void> {
    const source = await this.repository.getById(id, userId)

    if (!source) {
      throw new NotFoundException()
    }
    await this.repository.delete(id)
  }
}
