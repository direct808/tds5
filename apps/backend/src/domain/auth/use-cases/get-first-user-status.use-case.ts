import { Injectable } from '@nestjs/common'
import { AuthService } from '@/domain/auth/auth.service'
import { FirstUserStatusDto } from '@/domain/auth/dto/first-user-status.dto'

@Injectable()
export class GetFirstUserStatusUseCase {
  constructor(private readonly authService: AuthService) {}

  /** Returns whether the first admin user has been created. */
  public async execute(): Promise<FirstUserStatusDto> {
    const created = await this.authService.hasUsers()

    return { created }
  }
}
