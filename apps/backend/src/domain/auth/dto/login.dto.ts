import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  declare login: string

  @ApiProperty()
  @IsString()
  @MinLength(4)
  declare password: string
}
