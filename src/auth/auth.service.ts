import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getByEmail(username)
    if (user?.password !== pass) {
      throw new UnauthorizedException()
    }

    const payload = { sub: user.id, email: user.email }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
