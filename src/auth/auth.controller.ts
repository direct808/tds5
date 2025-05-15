import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginRequest, SkipAuth } from './types'
import { ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: LoginRequest) {
    return this.authService.sign(req.user)
  }
}
