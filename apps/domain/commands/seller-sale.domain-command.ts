export interface ISellerSaleDomainCommand {
  products: { productId: string; quantity: number }[];
  branchId: string;
  userId: string;
  discount: number;
}
