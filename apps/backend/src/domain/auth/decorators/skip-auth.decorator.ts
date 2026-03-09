import { type CustomDecorator, SetMetadata } from '@nestjs/common'

export const SKIP_AUTH = 'SKIP_AUTH'
export const SkipAuth: () => CustomDecorator = () =>
  SetMetadata(SKIP_AUTH, true)
