import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty()
  @IsString()
  declare login: string

  @ApiProperty()
  @IsString()
  declare password: string
}
