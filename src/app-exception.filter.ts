// import { ExceptionFilter } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ArgumentsHost, Logger } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'

export class AppExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    let message = exception.message

    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      message = JSON.stringify(response)
    }

    this.logger.error(message)
    super.catch(exception, host)
  }
}
