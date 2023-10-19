import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ValueObjectException } from '@sofka/exceptions';

@Catch(ValueObjectException)
export class ValueObjectExceptionFilter implements ExceptionFilter {
  catch(exception: ValueObjectException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const message = exception.message;
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const details = exception.errors;

    response.status(statusCode).json({ statusCode, message, details });
  }
}
