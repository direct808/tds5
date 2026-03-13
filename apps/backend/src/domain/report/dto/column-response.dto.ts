import { ApiProperty } from '@nestjs/swagger'

export class ColumnResponseDto {
  @ApiProperty()
  declare column: string

  @ApiProperty()
  declare name: string

  @ApiProperty()
  declare default: boolean
}
