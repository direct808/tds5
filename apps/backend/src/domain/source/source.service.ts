import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  SourceUpdatedEvent,
  sourceUpdateEventName,
} from './events/source-updated.event'
import {
  checkUniqueNameForCreate,
  softDeleteManyWithCheck,
  validateBeforeUpdate,
} from '@/infra/repositories/utils/repository-utils'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { SourceModel } from '@generated/prisma/models/Source'
import {
  SourceSoftDeletedEvent,
  sourceSoftDeletedEventName,
} from '@/domain/source/events/source-soft-deleted.event'

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
  ids: string[]
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
    await validateBeforeUpdate(this.repository, args)

    await this.repository.update(args.id, args)

    this.eventEmitter.emit(
      sourceUpdateEventName,
      new SourceUpdatedEvent(args.id),
    )
  }

  public getList(userId: string): Promise<SourceModel[]> {
    return this.repository.getListByUserId(userId)
  }

  public async deleteMany(args: DeleteArgs): Promise<void> {
    await softDeleteManyWithCheck(this.repository, args)

    this.eventEmitter.emit(
      sourceSoftDeletedEventName,
      new SourceSoftDeletedEvent(args.ids),
    )
  }
}
