import { EventSubscriberBase } from '@sofka/bases';
import { Observable } from 'rxjs';

export class EventSubscriber extends EventSubscriberBase {
  subscribe(pattern: any) {
    console.log('Suscrito al patrón:', pattern);
    return new Observable<any>();
  }

  handleEvent(event: any) {
    console.log('Evento recibido:', event);
  }
}
