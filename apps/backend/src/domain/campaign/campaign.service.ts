import { Injectable } from '@nestjs/common'
import { SourceRepository } from '../../infra/repositories/source.repository'
import { ensureEntityExists } from '../../infra/repositories/utils/repository-utils'
import { DomainRepository } from '../../infra/repositories/domain.repository'
import { isNullable } from '@/shared/helpers'

type EnsureSourceExistsArgs = {
  userId: string
  sourceId?: string
}

type EnsureDomainExistsArgs = {
  userId: string
  domainId?: string
}

@Injectable()
export class CampaignService {
  constructor(
    private readonly sourceRepository: SourceRepository,
    private readonly domainRepository: DomainRepository,
  ) {}

  public async ensureSourceExists({
    userId,
    sourceId,
  }: EnsureSourceExistsArgs): Promise<void> {
    if (isNullable(sourceId)) {
      return
    }
    await ensureEntityExists(
      this.sourceRepository,
      {
        userId,
        ids: [sourceId],
      },
      'Source not found',
    )
  }

  public async ensureDomainExists({
    userId,
    domainId,
  }: EnsureDomainExistsArgs): Promise<void> {
    if (isNullable(domainId)) {
      return
    }
    await ensureEntityExists(
      this.domainRepository,
      {
        userId,
        ids: [domainId],
      },
      'Domain not found',
    )
  }
}
