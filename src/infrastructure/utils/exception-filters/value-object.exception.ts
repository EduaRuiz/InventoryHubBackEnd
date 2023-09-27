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
    const response = host.switchToHttp().getResponse();
    const status = HttpStatus.BAD_REQUEST; // Puedes cambiar el estado según tus necesidades

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      errors: exception.errors,
    });
  }
}
