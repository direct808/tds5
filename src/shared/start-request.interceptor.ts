import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { finalize, Observable } from 'rxjs'

@Injectable()
export class StartRequestInterceptor implements NestInterceptor {
  private readonly logger = new Logger('StartRequestInterceptor')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now()
    const name = context.getHandler().name
    this.logger.log(`Start request ${name}`)

    return next.handle().pipe(
      finalize(() => {
        const duration = Date.now() - now
        this.logger.log(`End request ${name}, duration: ${duration}`)
      }),
    )
  }
}
