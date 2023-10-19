import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad para not found de swagger
 *
 * @export
 * @class NotFoundSwagger
 */
export class NotFoundSwagger {
  /**
   * Código de estado
   *
   * @type {number}
   * @memberof BadRequestSwagger
   */
  @ApiProperty()
  statusCode: number;
  /**
   * Mensaje
   *
   * @type {string[]}
   * @memberof BadRequestSwagger
   */
  @ApiProperty()
  message: string[];
  /**
   * Error
   *
   * @type {string}
   * @memberof BadRequestSwagger
   */
  @ApiProperty()
  error: string;
}
