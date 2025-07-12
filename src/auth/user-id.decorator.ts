import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AppRequest } from './types.js'

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AppRequest>()
    if (!request.user) {
      throw new UnauthorizedException('Не найден объект user')
    }
    if (!request.user.sub) {
      throw new UnauthorizedException('Не найдено поле sub в объекте user')
    }
    return request.user.sub
  },
)
