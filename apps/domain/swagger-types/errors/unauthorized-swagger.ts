import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de swagger para no autorizado
 *
 * @export
 * @class UnauthorizedSwagger
 */
export class UnauthorizedSwagger {
  /**
   * Código de error
   *
   * @type {number}
   * @memberof UnauthorizedSwagger
   */
  @ApiProperty()
  statusCode: number;
  /**
   * Mensaje de error
   *
   * @type {string}
   * @memberof UnauthorizedSwagger
   */
  @ApiProperty()
  message: string;
}
