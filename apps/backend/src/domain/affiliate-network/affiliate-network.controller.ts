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
import { UserId } from '@/domain/auth/user-id.decorator'
import { AffiliateNetworkService } from './affiliate-network.service'
import { CreateAffiliateNetworkDto } from './dto/create-affiliate-network.dto'
import { UpdateAffiliateNetworkDto } from './dto/update-affiliate-network.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { AffiliateNetworkModel } from '@generated/prisma/models/AffiliateNetwork'
import { ListAffiliateNetworkUseCase } from './use-cases/list-affiliate-network.use-case'
import { GetAffiliateNetworkColumnsUseCase } from './use-cases/get-affiliate-network-columns.use-case'
import { ListAffiliateNetworkDto } from './dto/list-affiliate-network.dto'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { DeleteAffiliateNetworkDto } from '@/domain/affiliate-network/dto/delete-affiliate-network.dto'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@ApiTags('Партнерские сети')
@Controller(GLOBAL_PREFIX + 'affiliate-network')
export class AffiliateNetworkController {
  constructor(
    private readonly affiliateNetworkService: AffiliateNetworkService,
    private readonly listAffiliateNetworkUseCase: ListAffiliateNetworkUseCase,
    private readonly getAffiliateNetworkColumnsUseCase: GetAffiliateNetworkColumnsUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ReportResponseDto })
  listAffiliateNetworks(
    @Query() args: ListAffiliateNetworkDto,
    @UserId() userId: string,
  ): Promise<ReportResponseDto> {
    return this.listAffiliateNetworkUseCase.execute(args, userId)
  }

  @Post()
  async createAffiliateNetwork(
    @Body() args: CreateAffiliateNetworkDto,
    @UserId() userId: string,
  ): Promise<AffiliateNetworkModel> {
    return this.affiliateNetworkService.create({ ...args, userId })
  }

  @Patch(':id')
  async updateAffiliateNetwork(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
    @Body() dto: UpdateAffiliateNetworkDto,
  ): Promise<void> {
    await this.affiliateNetworkService.update({ ...dto, id, userId })
  }

  @Delete()
  async deleteAffiliateNetwork(
    @Body() { ids }: DeleteAffiliateNetworkDto,
    @UserId() userId: string,
  ): Promise<void> {
    await this.affiliateNetworkService.deleteMany({ ids, userId })
  }

  @Get('columns')
  @ApiResponse({ type: ColumnResponseDto, isArray: true })
  getColumns(): ColumnResponseDto[] {
    return this.getAffiliateNetworkColumnsUseCase.execute()
  }
}
