import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateSourceDto } from './dto'
import { SourceService } from './source.service'
import { UserId } from '../auth'

@ApiTags('Источники трафика')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  getSources() {
    return []
  }

  @Post()
  async createSource(
    @Body() { name }: CreateSourceDto,
    @UserId() userId: string,
  ) {
    await this.sourceService.create({ name, userId })
  }

  @Patch(':id')
  updateSource(@Param('id', ParseIntPipe) id: number) {
    console.log(id)
  }

  @Delete(':id')
  deleteSource(@Param('id') id: number) {}
}
