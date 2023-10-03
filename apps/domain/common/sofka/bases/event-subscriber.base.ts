import { Observable } from 'rxjs';

/**
 * Abstract class representing an event subscriber
 */
export abstract class EventSubscriberBase {
  /**
   * Subscribe to events based on a pattern
   *
   * @param {*} pattern Pattern to subscribe to
   * @return {*} {Observable<any>} Observable to receive events
   */
  abstract subscribe(pattern: any): Observable<any>;

  /**
   * Handle the received event
   *
   * @param {*} event Received event
   */
  abstract handleEvent(event: any): void;
}
