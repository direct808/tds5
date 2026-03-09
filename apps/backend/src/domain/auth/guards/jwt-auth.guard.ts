import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard, IAuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { AuthService } from '@/domain/auth/auth.service'
import { ensurePromise } from '@/shared/ensure-promise'
import { SKIP_AUTH } from '@/domain/auth/decorators/skip-auth.decorator'
import { SKIP_CHECK_ADMIN_CREATED } from '@/domain/auth/decorators/skip-check-admin-created.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super()
  }

  canActivate: IAuthGuard['canActivate'] = async (context) => {
    const skipCheckAdminCreated = this.checkDecorator(
      context,
      SKIP_CHECK_ADMIN_CREATED,
    )

    if (skipCheckAdminCreated) {
      return true
    }

    await this.authService.checkIfAdminCreated()

    const skipAuth = this.checkDecorator(context, SKIP_AUTH)

    if (skipAuth) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    if (request.path === '/metrics') {
      return true
    }

    return ensurePromise(super.canActivate(context))
  }

  private checkDecorator(
    context: ExecutionContext,
    decorator: string,
  ): boolean {
    return this.reflector.getAllAndOverride<boolean>(decorator, [
      context.getHandler(),
      context.getClass(),
    ])
  }
}
