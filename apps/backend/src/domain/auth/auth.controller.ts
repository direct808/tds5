import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginRequest } from './types'
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { CreateFirstUserDto } from '@/domain/auth/dto/create-first-user.dto'
import { CreateFirstUserUseCase } from '@/domain/auth/use-cases/create-first-user.use-case'
import { GetFirstUserStatusUseCase } from '@/domain/auth/use-cases/get-first-user-status.use-case'
import { SkipAuth } from '@/domain/auth/decorators/skip-auth.decorator'
import { SkipCheckAdminCreated } from '@/domain/auth/decorators/skip-check-admin-created.decorator'
import {
  ErrorResponseDto,
  LoginResponseDto,
} from '@/domain/auth/dto/login-response.dto'
import { FirstUserStatusDto } from '@/domain/auth/dto/first-user-status.dto'

@ApiTags('Аутентификация')
@Controller(GLOBAL_PREFIX + 'auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly createFirstUserUseCase: CreateFirstUserUseCase,
    private readonly getFirstUserStatusUseCase: GetFirstUserStatusUseCase,
  ) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Неверный логин или пароль',
    type: ErrorResponseDto,
  })
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Req() req: LoginRequest,
  ): LoginResponseDto {
    return this.authService.sign(req.user)
  }

  @SkipAuth()
  @SkipCheckAdminCreated()
  @ApiOkResponse({ type: LoginResponseDto })
  @Post('first-user')
  createFirstUser(@Body() dto: CreateFirstUserDto): Promise<LoginResponseDto> {
    return this.createFirstUserUseCase.execute(dto)
  }

  @SkipAuth()
  @SkipCheckAdminCreated()
  @ApiOkResponse({ type: FirstUserStatusDto })
  @Get('first-user')
  getFirstUserStatus(): Promise<FirstUserStatusDto> {
    return this.getFirstUserStatusUseCase.execute()
  }
}
