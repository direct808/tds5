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
import { UserId } from '../auth/user-id.decorator.js'
import { AffiliateNetworkService } from './affiliate-network.service.js'
import { CreateAffiliateNetworkDto } from './dto/create-affiliate-network.dto.js'
import { UpdateAffiliateNetworkDto } from './dto/update-affiliate-network.dto.js'
import { GLOBAL_PREFIX } from '../utils/constants.js'
import { AffiliateNetwork } from './affiliate-network.entity.js'

@ApiTags('Партнерские сети')
@Controller(GLOBAL_PREFIX + 'affiliate-network')
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
  ): Promise<AffiliateNetwork> {
    return this.affiliateNetworkService.create({ ...args, userId })
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
