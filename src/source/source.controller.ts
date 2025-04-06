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

@ApiTags('Источники трафика')
@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  getTrafficSources() {
    return []
  }

  @Post()
  async createTrafficSource(@Body() { name }: CreateSourceDto) {
    await this.sourceService.create(name)
  }

  @Patch(':id')
  updateTrafficSource(@Param('id', ParseIntPipe) id: number) {
    console.log(id)
  }

  @Delete(':id')
  deleteTrafficSource(@Param('id') id: number) {}
}
