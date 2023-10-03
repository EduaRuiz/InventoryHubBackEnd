import { Observable } from 'rxjs';

export interface IEventPublisher {
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
