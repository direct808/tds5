import { type CustomDecorator, SetMetadata } from '@nestjs/common'

export const SKIP_CHECK_ADMIN_CREATED = 'SKIP_CHECK_ADMIN_CREATED'
export const SkipCheckAdminCreated: () => CustomDecorator = () =>
  SetMetadata(SKIP_CHECK_ADMIN_CREATED, true)
