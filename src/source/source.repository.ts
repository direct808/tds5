import { Repository } from 'typeorm'
import { Source } from './source.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SourceRepository {
  constructor(
    @InjectRepository(Source) private readonly repository: Repository<Source>,
  ) {}

  public async create(args: Pick<Source, 'name' | 'userId'>): Promise<void> {
    const source = this.repository.create(args)

    await this.repository.insert(source)
  }

  public async getByName(name: string, userId: string): Promise<Source | null> {
    return this.repository.findOne({ where: { name, userId } })
  }
}
