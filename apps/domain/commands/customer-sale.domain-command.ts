export interface ICustomerSaleDomainCommand {
  productos: { productId: string; quantity: number }[];
  branchId: string;
  userId: string;
}
