import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `${request.method} ${request.originalUrl} ${status}
      error: ${exception.message}
      cause: ${exception.cause}
      `,
    );

    response.status(status).json({
      error: true,
      errorDetail: exception.getResponse(),
    });
  }
}
