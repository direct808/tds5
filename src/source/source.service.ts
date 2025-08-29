import { SourceRepository } from './source.repository'
import { Injectable } from '@nestjs/common'
import { Source } from './source.entity'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '@/utils/repository-utils'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  SourceUpdatedEvent,
  sourceUpdateEventName,
} from '@/source/events/source-updated.event'

type CreateArgs = {
  name: string
  userId: string
}

type UpdatedArgs = {
  name?: string
  id: string
  userId: string
}

type DeleteArgs = {
  id: string
  userId: string
}

@Injectable()
export class SourceService {
  constructor(
    private readonly repository: SourceRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async create(args: CreateArgs): Promise<void> {
    await checkUniqueNameForCreate(this.repository, args)

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

    await this.repository.update(args.id, args)

    this.eventEmitter.emit(
      sourceUpdateEventName,
      new SourceUpdatedEvent(args.id),
    )
  }

  public async getList(userId: string): Promise<Source[]> {
    return this.repository.getListByUserId(userId)
  }

  public async delete(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.delete(args.id)
  }
}
