import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
  @ApiProperty()
  declare accessToken: string
}

export class ErrorResponseDto {
  @ApiProperty()
  declare message: string

  @ApiProperty()
  declare statusCode: number
}
