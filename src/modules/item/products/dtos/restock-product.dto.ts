import { Product } from '../models';

export class RestockProductDto {
  quantity: number;
  productId: number;
  isShipReserved: boolean;
  product?: Product;
}
