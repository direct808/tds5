import { BaseExceptionFilter } from '@nestjs/core'
import { ArgumentsHost, HttpException, Logger } from '@nestjs/common'

export class AppExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost): void {
    let message = exception.message

    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      message = JSON.stringify(response)
    }

    this.logger.error(message)
    super.catch(exception, host)
  }
}
