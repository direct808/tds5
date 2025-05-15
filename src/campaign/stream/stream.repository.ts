import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'
import { Stream } from '../entity/stream.entity'

@Injectable()
export class StreamRepository {
  public async create(
    manager: EntityManager,
    args: Partial<Stream>,
  ): Promise<Stream> {
    const campaign = manager.create(Stream, args)

    return manager.save(campaign)
  }

  public async update(
    manager: EntityManager,
    id: string,
    args: Partial<Stream>,
  ): Promise<void> {
    await manager.update(Stream, id, args)
  }

  public getByCampaignId(
    manager: EntityManager,
    campaignId: string,
  ): Promise<Stream[]> {
    return manager.findBy(Stream, { campaignId })
  }

  public async delete(manager: EntityManager, ids: string[]): Promise<void> {
    await manager.delete(Stream, ids)
  }

  getByIdsAndCampaignId(
    manager: EntityManager,
    ids: string[],
    campaignId: string,
  ): Promise<Stream[]> {
    return manager.findBy(Stream, {
      id: In(ids),
      campaignId,
    })
  }
}
