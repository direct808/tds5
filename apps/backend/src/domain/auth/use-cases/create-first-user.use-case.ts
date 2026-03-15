import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateFirstUserDto } from '@/domain/auth/dto/create-first-user.dto'
import { AuthService } from '@/domain/auth/auth.service'
import { UserRepository } from '@/infra/repositories/user.repository'
import * as bcrypt from 'bcrypt'
import { LoginResponseDto } from '@/domain/auth/dto/login-response.dto'

const BCRYPT_HASH_ROUNDS = 10

@Injectable()
export class CreateFirstUserUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(dto: CreateFirstUserDto): Promise<LoginResponseDto> {
    const hasUsers = await this.authService.hasUsers()

    if (hasUsers) {
      throw new BadRequestException('User already created')
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const password = await bcrypt.hash(dto.password, BCRYPT_HASH_ROUNDS)

    const user = await this.userRepository.create({
      login: dto.login,
      password,
    })

    this.authService.clearHasUsersCache()

    return this.authService.sign({ login: dto.login, id: user.id })
  }
}
