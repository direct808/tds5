import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateFirstUserDto {
  @ApiProperty()
  @IsString()
  declare login: string

  @ApiProperty()
  @IsString()
  declare password: string

  @ApiProperty()
  @IsString()
  declare confirmPassword: string
}
