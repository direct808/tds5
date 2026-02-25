import { Injectable, NotFoundException } from '@nestjs/common'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { GetByIdResponseDto } from '@/domain/offer/dto/get-by-id-response.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class GetByIdUseCase {
  constructor(private readonly offerRepository: OfferRepository) {}

  public async execute(
    id: string,
    userId: string,
  ): Promise<GetByIdResponseDto> {
    const entity = await this.offerRepository.getByIdAndUserId({ id, userId })

    if (!entity) {
      throw new NotFoundException(`Offer not found ${id}`)
    }

    return plainToInstance(GetByIdResponseDto, entity, {
      strategy: 'excludeAll',
    })
  }
}
