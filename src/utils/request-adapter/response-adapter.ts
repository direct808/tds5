import { HttpStatus } from '@nestjs/common/enums/http-status.enum'

export interface ResponseAdapter {
  status(name: HttpStatus): this

  redirect(url: string): void

  send(data: string | object): this

  cookie(
    name: string,
    value: string,
    options?: {
      maxAge?: number
    },
  ): this
}
