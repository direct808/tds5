import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AppRequest } from '../../domain/auth/types'

export const CurrentUserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<AppRequest>()

    if (!request.user) {
      throw new Error('No request.user')
    }

    return request.user.email
  },
)
