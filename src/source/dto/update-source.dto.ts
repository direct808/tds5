import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateSourceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  declare name: string
}
