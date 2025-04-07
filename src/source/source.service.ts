import { SourceRepository } from './source.repository'
import { ConflictException, Injectable } from '@nestjs/common'

type CreateArgs = {
  name: string
  userId: string
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
}
