import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class GetByIdResponseDto {
  @ApiProperty()
  @Expose()
  declare id: string

  @ApiProperty()
  @Expose()
  declare name: string

  @ApiProperty()
  @Expose()
  declare url: string
}
