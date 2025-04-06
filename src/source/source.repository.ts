import { Repository } from 'typeorm'
import { Source } from './source.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class SourceRepository {
  constructor(
    @InjectRepository(Source) private readonly repository: Repository<Source>,
  ) {}

  public async create(name: string): Promise<void> {
    const source = this.repository.create({ name })

    await this.repository.insert(source)
  }
}
