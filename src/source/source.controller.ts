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

@ApiTags('Источники трафика')
@Controller('source')
export class SourceController {
  @Get()
  getTrafficSources() {
    return []
  }

  @Post()
  createTrafficSource(@Body() data: CreateSourceDto) {}

  @Patch(':id')
  updateTrafficSource(@Param('id', ParseIntPipe) id: number) {
    console.log(id)
  }

  @Delete(':id')
  deleteTrafficSource(@Param('id') id: number) {}
}
