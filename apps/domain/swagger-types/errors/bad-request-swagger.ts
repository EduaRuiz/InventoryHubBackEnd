import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad para respuestas de malos request
 *
 * @export
 * @class BadRequestSwagger
 */
export class BadRequestSwagger {
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
