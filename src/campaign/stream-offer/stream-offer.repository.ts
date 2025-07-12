import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { StreamOffer } from '../entity/stream-offer.entity.js'

@Injectable()
export class StreamOfferRepository {
  public async saveMany(
    manager: EntityManager,
    args: Partial<StreamOffer>[],
  ): Promise<StreamOffer[]> {
    const entity = manager.create(StreamOffer, args)

    return manager.save(entity)
  }

  public getByStreamId(
    manager: EntityManager,
    streamId: string,
  ): Promise<StreamOffer[]> {
    return manager.findBy(StreamOffer, { streamId })
  }

  public async delete(manager: EntityManager, ids: string[]): Promise<void> {
    await manager.delete(StreamOffer, ids)
  }
}
