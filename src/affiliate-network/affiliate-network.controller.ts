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
import { UserId } from '../auth/user-id.decorator'
import { AffiliateNetworkService } from './affiliate-network.service'
import { CreateAffiliateNetworkDto } from './dto/create-affiliate-network.dto'
import { UpdateAffiliateNetworkDto } from './dto/update-affiliate-network.dto'

@ApiTags('Партнерские сети')
@Controller('affiliate-network')
export class AffiliateNetworkController {
  constructor(
    private readonly affiliateNetworkService: AffiliateNetworkService,
  ) {}

  @Get()
  getAffiliateNetworks(@UserId() userId: string) {
    return this.affiliateNetworkService.getList(userId)
  }

  @Post()
  async createAffiliateNetwork(
    @Body() args: CreateAffiliateNetworkDto,
    @UserId() userId: string,
  ) {
    await this.affiliateNetworkService.create({ ...args, userId })
  }

  @Patch(':id')
  async updateAffiliateNetwork(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateAffiliateNetworkDto,
  ) {
    await this.affiliateNetworkService.update({ ...dto, id, userId })
  }

  @Delete(':id')
  async deleteAffiliateNetwork(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    await this.affiliateNetworkService.delete({ id, userId })
  }
}
