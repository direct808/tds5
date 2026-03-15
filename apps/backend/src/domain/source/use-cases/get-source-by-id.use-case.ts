import { Injectable, NotFoundException } from '@nestjs/common'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { GetSourceByIdResponseDto } from '@/domain/source/dto/get-source-by-id-response.dto'
import { plainToInstance } from 'class-transformer'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class GetSourceByIdUseCase {
  constructor(private readonly sourceRepository: SourceRepository) {}

  /** Retrieves a single source by id for the given user. */
  public async execute(
    id: string,
    userId: string,
  ): Promise<GetSourceByIdResponseDto> {
    const [entity] = await this.sourceRepository.getByIdsAndUserId({
      ids: [id],
      userId,
    })

    if (isNullable(entity)) {
      throw new NotFoundException(`Source not found ${id}`)
    }

    return plainToInstance(GetSourceByIdResponseDto, entity)
  }
}
