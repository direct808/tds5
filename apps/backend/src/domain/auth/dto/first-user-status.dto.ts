import { ApiProperty } from '@nestjs/swagger'

export class FirstUserStatusDto {
  /** Indicates whether the first admin user has been created. */
  @ApiProperty()
  declare created: boolean
}