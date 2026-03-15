import { Injectable, NotFoundException } from '@nestjs/common'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { GetOfferByIdResponseDto } from '@/domain/offer/dto/get-offer-by-id-response.dto'
import { plainToInstance } from 'class-transformer'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class GetOfferByIdUseCase {
  constructor(private readonly offerRepository: OfferRepository) {}

  public async execute(
    id: string,
    userId: string,
  ): Promise<GetOfferByIdResponseDto> {
    const entity = await this.offerRepository.getByIdAndUserId({ id, userId })

    if (isNullable(entity)) {
      throw new NotFoundException(`Offer not found ${id}`)
    }

    return plainToInstance(GetOfferByIdResponseDto, entity)
  }
}
