import { SourceRepository } from './source.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SourceService {
  constructor(private readonly repository: SourceRepository) {}

  public async create(name: string): Promise<void> {
    await this.repository.create(name)
  }
}
