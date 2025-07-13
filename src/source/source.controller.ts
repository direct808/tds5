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
import { SourceService } from './source.service.js'
import { UserId } from '../auth/user-id.decorator.js'
import { CreateSourceDto } from './dto/create-source.dto.js'
import { UpdateSourceDto } from './dto/update-source.dto.js'
import { GLOBAL_PREFIX } from '../utils/constants.js'

@ApiTags('Источники трафика')
@Controller(GLOBAL_PREFIX + 'source')
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
    await this.sourceService.update({ ...dto, id, userId })
  }

  @Delete(':id')
  async deleteSource(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    await this.sourceService.delete({ id, userId })
  }
}
