import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { CreateDomainDto } from '@/domain/domain/dto/create-domain.dto'
import { CreateDomainUseCase } from '@/domain/domain/use-cases/create-domain-use-case.service'
import { UserId } from '@/domain/auth/user-id.decorator'
import { ListDomainUseCase } from '@/domain/domain/use-cases/list-domain-use-case.service'
import { DomainModel } from '@generated/prisma/models/Domain'
import { UpdateDomainDto } from '@/domain/domain/dto/update-domain.dto'
import { UpdateDomainUseCase } from '@/domain/domain/use-cases/update-domain-use-case.service'
import { DeleteDomainUseCase } from '@/domain/domain/use-cases/delete-domain-use-case.service'

@Controller(GLOBAL_PREFIX + 'domain')
export class DomainController {
  constructor(
    private readonly createDomainUseCase: CreateDomainUseCase,
    private readonly listDomainUseCase: ListDomainUseCase,
    private readonly updateDomainUseCase: UpdateDomainUseCase,
    private readonly deleteDomainUseCase: DeleteDomainUseCase,
  ) {}

  @Post()
  async createDomain(
    @Body() data: CreateDomainDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.createDomainUseCase.handle(data, userId)
  }

  @Get()
  listDomain(@UserId() userId: string): Promise<DomainModel[]> {
    return this.listDomainUseCase.handle(userId)
  }

  @Patch(':id')
  updateDomain(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateDomainDto,
    @UserId() userId: string,
  ): Promise<void> {
    return this.updateDomainUseCase.handle(id, data, userId)
  }

  @Delete(':id')
  deleteDomain(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ): Promise<void> {
    return this.deleteDomainUseCase.handle(id, userId)
  }
}
