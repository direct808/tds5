import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginUser } from './types'
import * as bcrypt from 'bcrypt'
import { UserRepository } from '@/infra/repositories/user.repository'
import { isNullable } from '@/shared/helpers'
import memoize from 'memoizee'
import { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    login: string,
    pass: string,
  ): Promise<LoginUser | null> {
    const user = await this.userRepository.getByLogin(login)
    if (isNullable(user)) {
      return null
    }
    const passwordEqual = await this.comparePassword(pass, user.password)
    if (!passwordEqual) {
      return null
    }
    const { password, ...result } = user

    return result
  }

  private comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  public sign(user: LoginUser): LoginResponseDto {
    const payload = { login: user.login, sub: user.id }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  public hasUsers = memoize(async (): Promise<boolean> => {
    const count = await this.userRepository.count()

    return count > 0
  })

  public clearHasUsersCache(): void {
    this.hasUsers.clear()
  }

  public async checkIfAdminCreated(): Promise<void> {
    const hasUsers = await this.hasUsers()
    if (!hasUsers) {
      throw new HttpException(
        {
          error: 'ADMIN_NOT_CREATED',
          message: 'Create the first user to initialize the system',
        },
        428,
      )
    }
  }
}
