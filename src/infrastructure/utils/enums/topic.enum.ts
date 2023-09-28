export enum Topic {
  PRODUCT_REGISTERED = 'inventory.product_registered',
  PRODUCT_UPDATED = 'inventory.product_updated',
  PRODUCT_DELETED = 'inventory.product_deleted',
  PRODUCT_STATE_CHANGED = 'inventory.product_state_changed',
  PRODUCT_PURCHASE_REGISTERED = 'inventory.product_purchase_registered',

  BRANCH_REGISTERED = 'inventory.branch_registered',
  BRANCH_UPDATED = 'inventory.branch_updated',
  BRANCH_DELETED = 'inventory.branch_deleted',

  USER_REGISTERED = 'inventory.user_registered',
  USER_UPDATED = 'inventory.user_updated',
  USER_DELETED = 'inventory.user_deleted',

  CUSTOMER_SALE_REGISTERED = 'inventory.customer_sale_registered',
  SELLER_SALE_REGISTERED = 'inventory.seller_sale_registered',
}
