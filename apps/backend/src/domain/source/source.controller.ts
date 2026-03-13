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
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { SourceService } from './source.service'
import { UserId } from '@/domain/auth/user-id.decorator'
import { CreateSourceDto } from './dto/create-source.dto'
import { UpdateSourceDto } from './dto/update-source.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ListSourceUseCase } from '@/domain/source/use-cases/list-source.use-case'
import { GetSourceColumnsUseCase } from './use-cases/get-source-columns.use-case'
import { ListSourceDto } from './dto/list-source.dto'
import { ReportResponse } from '@/domain/report/types'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { DeleteSourceDto } from '@/domain/source/dto/delete-source.dto'

@ApiTags('Источники трафика')
@Controller(GLOBAL_PREFIX + 'source')
export class SourceController {
  constructor(
    private readonly sourceService: SourceService,
    private readonly listSourceUseCase: ListSourceUseCase,
    private readonly getSourceColumnsUseCase: GetSourceColumnsUseCase,
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

  @Delete()
  async deleteSource(
    @Body() { ids }: DeleteSourceDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.sourceService.deleteMany({ ids, userId })
  }

  @Get('columns')
  @ApiResponse({ type: ColumnResponseDto, isArray: true })
  getColumns(): ColumnResponseDto[] {
    return this.getSourceColumnsUseCase.execute()
  }
}
