import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SourceService } from './source.service'
import { UserId } from '@/domain/auth/user-id.decorator'
import { CreateSourceDto } from './dto/create-source.dto'
import { UpdateSourceDto } from './dto/update-source.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ListSourceUseCase } from '@/domain/source/ues-cases/list-source.use-case'
import { ListSourceDto } from '@/domain/source/dto/list-source.dto'
import { ReportResponse } from '@/domain/report/types'

@ApiTags('Источники трафика')
@Controller(GLOBAL_PREFIX + 'source')
export class SourceController {
  constructor(
    private readonly sourceService: SourceService,
    private readonly listSourceUseCase: ListSourceUseCase,
  ) {}

  @Get()
  listSources(
    @Query() args: ListSourceDto,
    @UserId() userId: string,
  ): Promise<ReportResponse> {
    return this.listSourceUseCase.execute(args, userId)
  }

  @Post()
  async createSource(
    @Body() { name }: CreateSourceDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.sourceService.create({ name, userId })
  }

  @Patch(':id')
  async updateSource(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateSourceDto,
  ): Promise<void> {
    await this.sourceService.update({ ...dto, id, userId })
  }

  @Delete(':id')
  async deleteSource(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ): Promise<void> {
    await this.sourceService.delete({ id, userId })
  }
}
