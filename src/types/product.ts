export type ProductListObject = {
  product_id: string;
  name: string;
  sku: string;
  active: string;
}

export type DeleteProductList = {
  total_success: number;
  total_failed: number;
};