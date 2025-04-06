import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSourceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string
}
