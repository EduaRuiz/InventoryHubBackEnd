export interface ISellerSaleDomainCommand {
  productos: { productId: string; quantity: number }[];
  branchId: string;
  userId: string;
  discount: number;
}
