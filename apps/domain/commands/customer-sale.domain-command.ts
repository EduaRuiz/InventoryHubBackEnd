export interface ICustomerSaleDomainCommand {
  products: { productId: string; quantity: number }[];
  branchId: string;
  userId: string;
}
