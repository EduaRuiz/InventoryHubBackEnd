import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { ValueObjectExceptionFilter } from '..';
import { ValueObjectException } from '@sofka/exceptions';

describe('ValueObjectExceptionFilter', () => {
  let valueObjectExceptionFilter: ValueObjectExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    valueObjectExceptionFilter = new ValueObjectExceptionFilter();
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as any as ArgumentsHost;
  });

  it('should catch and handle ValueObjectException', () => {
    // Arrange
    const exception = {
      message: 'Duplicate key error',
      errors: {
        message: 'Duplicate key error',
      },
    } as unknown as ValueObjectException;
    const expectedResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Duplicate key error',
      details: exception.errors,
    };

    // Act
    valueObjectExceptionFilter.catch(exception, mockArgumentsHost);
    const response = mockArgumentsHost.switchToHttp().getResponse<Response>();

    // Assert
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith(expectedResponse);
  });
});
