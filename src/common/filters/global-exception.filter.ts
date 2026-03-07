import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getExceptionMessage(exception);

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`[${request.method}] ${request.url} - ${message}`);
    }

    response.status(statusCode).json({
      statusCode,
      status: false,
      timestamp: new Date().toISOString(),
      message,
    });
  }

  private getExceptionMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      if (typeof resp === 'string') {
        return resp;
      }
      if (typeof resp === 'object' && resp !== null && 'message' in resp) {
        const msg = (resp as any).message;
        return Array.isArray(msg) ? msg[0] : msg;
      }
      return exception.message;
    }

    if (exception instanceof Error) {
      // In production you might want to hide internal server error messages
      return exception.message;
    }

    return 'Internal server error';
  }
}
