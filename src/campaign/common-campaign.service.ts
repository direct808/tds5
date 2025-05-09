import { ensureEntityExists } from '../utils'
import { Injectable } from '@nestjs/common'
import { SourceRepository } from '../source/source.repository'

@Injectable()
export class CommonCampaignService {
  constructor(private readonly sourceRepository: SourceRepository) {}

  public async ensureSourceExists(
    userId: string,
    sourceId?: string,
  ): Promise<void> {
    if (!sourceId) {
      return
    }
    await ensureEntityExists(
      this.sourceRepository,
      {
        userId,
        id: sourceId,
      },
      'Source not found',
    )
  }
}
