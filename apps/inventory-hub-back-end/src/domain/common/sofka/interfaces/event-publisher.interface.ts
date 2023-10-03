import { Observable } from 'rxjs';

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
   * @return {*}  {Observable<Result>}
   * @memberof IEventPublisher
   */
  send<Result = any, Input = any>(
    pattern: any,
    data: Input,
  ): Observable<Result>;
  /**
   * Emit data throw de pattern
   *
   * @template Result
   * @template Input
   * @param {*} pattern
   * @param {Input} data
   * @return {*}  {Observable<Result>}
   * @memberof IEventPublisher
   */
  emit<Result = any, Input = any>(
    pattern: any,
    data: Input,
  ): Observable<Result>;
}
