import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { Stream } from './entity'

@Injectable()
export class StreamRepository {
  public async create(
    manager: EntityManager,
    args: Partial<Stream>,
  ): Promise<Stream> {
    const campaign = manager.create(Stream, args)

    return manager.save(campaign)
  }
}
