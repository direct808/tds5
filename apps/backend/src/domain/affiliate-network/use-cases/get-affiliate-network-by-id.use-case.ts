import { Injectable, NotFoundException } from '@nestjs/common'
import { AffiliateNetworkRepository } from '@/infra/repositories/affiliate-network.repository'
import { GetAffiliateNetworkByIdResponseDto } from '@/domain/affiliate-network/dto/get-affiliate-network-by-id-response.dto'
import { plainToInstance } from 'class-transformer'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class GetAffiliateNetworkByIdUseCase {
  constructor(
    private readonly affiliateNetworkRepository: AffiliateNetworkRepository,
  ) {}

  /** Retrieves a single affiliate network by id for the given user. */
  public async execute(
    id: string,
    userId: string,
  ): Promise<GetAffiliateNetworkByIdResponseDto> {
    const [entity] = await this.affiliateNetworkRepository.getByIdsAndUserId({
      ids: [id],
      userId,
    })

    if (isNullable(entity)) {
      throw new NotFoundException(`Affiliate network not found ${id}`)
    }

    return plainToInstance(GetAffiliateNetworkByIdResponseDto, entity)
  }
}
