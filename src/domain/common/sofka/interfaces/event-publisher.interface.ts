/**
 * Interface representing a EventPublisher
 *
 * @export
 * @interface IEventPublisher
 */
export interface IEventPublisher {
  /**
   * send data throw de pattern
   *
   * @template Result
   * @template Input
   * @param {*} pattern
   * @param {Input} data
   * @return {*}  {Promise<Result>}
   * @memberof IEventPublisher
   */
  send<Result = any, Input = any>(pattern: any, data: Input): Promise<Result>;
  /**
   * Emit data throw de pattern
   *
   * @template Result
   * @template Input
   * @param {*} pattern
   * @param {Input} data
   * @return {*}  {Promise<Result>}
   * @memberof IEventPublisher
   */
  emit<Result = any, Input = any>(pattern: any, data: Input): Promise<Result>;
}
