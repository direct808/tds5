import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  declare email: string

  @ApiProperty()
  @IsString()
  declare password: string
}
