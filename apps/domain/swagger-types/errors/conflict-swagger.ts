import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad para respuestas de conflictos en el request
 *
 * @export
 * @class ConflictSwagger
 */
export class ConflictSwagger {
  /**
   * Código de estado
   *
   * @type {number}
   * @memberof ConflictSwagger
   */
  @ApiProperty()
  statusCode: number;
  /**
   * Mensaje
   *
   * @type {string[]}
   * @memberof ConflictSwagger
   */
  @ApiProperty()
  message: string[];
  /**
   * Error
   *
   * @type {string}
   * @memberof ConflictSwagger
   */
  @ApiProperty()
  error: string;
}
