import { ApiProperty } from '@nestjs/swagger'

export class LoginResponse {
  @ApiProperty()
  declare accessToken: string
}
