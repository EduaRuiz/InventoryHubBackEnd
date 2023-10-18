import { Observable } from 'rxjs';

export interface IMailDomainService {
  sendEmail(
    to: string[],
    subject: string,
    body: string,
    template?: string,
  ): Observable<string>;
}
