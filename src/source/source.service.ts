import { SourceRepository } from './source.repository'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Source } from './source.entity'

type CreateArgs = {
  name: string
  userId: string
}

type UpdatedArgs = {
  name: string
}

@Injectable()
export class SourceService {
  constructor(private readonly repository: SourceRepository) {}

  public async create(args: CreateArgs): Promise<void> {
    const existsSource = await this.repository.getByName(args.name, args.userId)

    if (existsSource) {
      throw new ConflictException('Источник с таким именем уже существует')
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

    await this.repository.update(id, args)
  }

  public async getList(userId: string): Promise<Source[]> {
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
