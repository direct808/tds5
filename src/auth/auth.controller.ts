import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto'
import { LoginRequest, SkipAuth } from './types'
import { JwtAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @UseGuards(JwtAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: LoginRequest) {
    return this.authService.sign(req.user)
  }
}
