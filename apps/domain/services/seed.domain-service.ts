import { Observable } from 'rxjs';
import { SeedUserDomainModel } from '..';

export interface ISeedService<
  Entity extends SeedUserDomainModel = SeedUserDomainModel,
> {
  seedData(): Observable<Entity>;
}
