import { Body, Controller, Post } from '@nestjs/common'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { CreateDomainDto } from '@/domain/domain/dto/create-domain.dto'
import { CreateDomainUseCase } from '@/domain/domain/use-cases/create-domain-use-case.service'
import { UserId } from '@/domain/auth/user-id.decorator'

@Controller(GLOBAL_PREFIX + 'domain')
export class DomainController {
  constructor(private readonly createDomainUseCase: CreateDomainUseCase) {}

  @Post()
  async createDomain(
    @Body() data: CreateDomainDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.createDomainUseCase.handle(data, userId)
  }
}
