import { Injectable } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { DomainService } from '@/domain/domain/domain.service'

@Injectable()
export class DeleteDomainUseCase {
  constructor(
    private readonly domainRepository: DomainRepository,
    private readonly domainService: DomainService,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    await this.domainService.getByIdAndUserIdOrNotFound(id, userId)

    await this.domainRepository.delete(id)
  }
}
