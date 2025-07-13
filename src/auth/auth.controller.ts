import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginRequest, SkipAuth } from './types.js'
import { ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto.js'
import { LocalAuthGuard } from './guards/local-auth.guard.js'
import { GLOBAL_PREFIX } from '../utils/constants.js'

@ApiTags('Аутентификация')
@Controller(GLOBAL_PREFIX + 'auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: LoginRequest) {
    return this.authService.sign(req.user)
  }
}
