import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetSourceByIdResponseDto {
  @ApiProperty()
  @Expose()
  declare id: string

  @ApiProperty()
  @Expose()
  declare name: string
}
