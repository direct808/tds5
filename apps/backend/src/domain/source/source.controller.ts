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
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SourceService } from './source.service'
import { UserId } from '@/domain/auth/user-id.decorator'
import { CreateSourceDto } from './dto/create-source.dto'
import { UpdateSourceDto } from './dto/update-source.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ListSourceUseCase } from '@/domain/source/use-cases/list-source.use-case'
import { GetSourceColumnsUseCase } from './use-cases/get-source-columns.use-case'
import { GetSourceByIdUseCase } from './use-cases/get-source-by-id.use-case'
import { ListSourceDto } from './dto/list-source.dto'
import { GetSourceByIdResponseDto } from './dto/get-source-by-id-response.dto'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { DeleteSourceDto } from '@/domain/source/dto/delete-source.dto'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@ApiTags('Источники трафика')
@Controller(GLOBAL_PREFIX + 'source')
export class SourceController {
  constructor(
    private readonly sourceService: SourceService,
    private readonly listSourceUseCase: ListSourceUseCase,
    private readonly getSourceColumnsUseCase: GetSourceColumnsUseCase,
    private readonly getSourceByIdUseCase: GetSourceByIdUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ReportResponseDto })
  listSources(
    @Query() args: ListSourceDto,
    @UserId() userId: string,
  ): Promise<ReportResponseDto> {
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

  @Get(':id')
  @ApiOkResponse({ type: GetSourceByIdResponseDto })
  getSourceById(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<GetSourceByIdResponseDto> {
    return this.getSourceByIdUseCase.execute(id, userId)
  }
}
