export interface INewProductDomainCommand {
  name: string;
  description: string;
  price: number;
  category: string;
  branchId: string;
}
