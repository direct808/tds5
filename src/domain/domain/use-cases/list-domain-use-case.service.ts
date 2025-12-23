import { Injectable } from '@nestjs/common'
import { DomainRepository } from '@/infra/repositories/domain.repository'
import { DomainModel } from '@generated/prisma/models/Domain'

@Injectable()
export class ListDomainUseCase {
  constructor(private readonly domainRepository: DomainRepository) {}

  public handle(userId: string): Promise<DomainModel[]> {
    return this.domainRepository.getListByUserId(userId)
  }
}
