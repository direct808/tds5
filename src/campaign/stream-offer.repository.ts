import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { StreamOffer } from './entity'

@Injectable()
export class StreamOfferRepository {
  public async create(
    manager: EntityManager,
    args: Partial<StreamOffer>[],
  ): Promise<StreamOffer[]> {
    const entity = manager.create(StreamOffer, args)

    return manager.save(entity)
  }
}
