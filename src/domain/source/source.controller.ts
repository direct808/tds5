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
import { ApiTags } from '@nestjs/swagger'
import { SourceService } from './source.service'
import { UserId } from '@/domain/auth/user-id.decorator'
import { CreateSourceDto } from './dto/create-source.dto'
import { UpdateSourceDto } from './dto/update-source.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { Source } from '@/domain/source/source.entity'

@ApiTags('Источники трафика')
@Controller(GLOBAL_PREFIX + 'source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  getSources(@UserId() userId: string): Promise<Source[]> {
    return this.sourceService.getList(userId)
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
