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
import { CreateSourceDto, UpdateSourceDto } from './dto'
import { SourceService } from './source.service'
import { UserId } from '../auth'

@ApiTags('Источники трафика')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  getSources(@UserId() userId: string) {
    return this.sourceService.getList(userId)
  }

  @Post()
  async createSource(
    @Body() { name }: CreateSourceDto,
    @UserId() userId: string,
  ) {
    await this.sourceService.create({ name, userId })
  }

  @Patch(':id')
  async updateSource(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateSourceDto,
  ) {
    await this.sourceService.update(id, userId, dto)
  }

  @Delete(':id')
  async deleteSource(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    await this.sourceService.delete(id, userId)
  }
}
