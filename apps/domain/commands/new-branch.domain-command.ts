import { Location } from '../types/location.type';
export interface INewBranchDomainCommand {
  name: string;
  location: Location;
}
