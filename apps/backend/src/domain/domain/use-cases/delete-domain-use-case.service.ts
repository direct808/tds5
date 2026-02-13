import { Injectable } from '@nestjs/common'
import { DomainRepository } from '../../../infra/repositories/domain.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'

@Injectable()
export class DeleteDomainUseCase {
  constructor(private readonly domainRepository: DomainRepository) {}

  public async execute(ids: string[], userId: string): Promise<void> {
    await ensureEntityExists(this.domainRepository, { ids, userId })

    await this.domainRepository.deleteMany(ids)
  }
}
