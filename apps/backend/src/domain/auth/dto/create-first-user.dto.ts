import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreateFirstUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  declare login: string

  @ApiProperty()
  @IsString()
  @MinLength(4)
  declare password: string

  @ApiProperty()
  @IsString()
  @MinLength(4)
  declare confirmPassword: string
}
