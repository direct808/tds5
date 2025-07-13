import { SourceRepository } from './source.repository.js'
import { Injectable } from '@nestjs/common'
import { Source } from './source.entity.js'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '../utils/repository-utils.js'

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
  constructor(private readonly repository: SourceRepository) {}

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
  }

  public async getList(userId: string): Promise<Source[]> {
    return this.repository.getListByUserId(userId)
  }

  public async delete(args: DeleteArgs): Promise<void> {
    await ensureEntityExists(this.repository, args)

    await this.repository.delete(args.id)
  }
}
