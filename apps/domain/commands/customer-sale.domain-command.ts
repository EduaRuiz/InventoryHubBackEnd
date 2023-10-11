export interface ICustomerSaleDomainCommand {
  products: { id: string; quantity: number }[];
  branchId: string;
  userId?: string;
}
