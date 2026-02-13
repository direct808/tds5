import { ApiProperty } from '@nestjs/swagger'

export class ListOfferResponseDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
  })
  declare rows: Record<string, string>[]

  @ApiProperty({ type: 'object', additionalProperties: { type: 'string' } })
  declare summary: Record<string, string>

  @ApiProperty()
  declare total: number
}
