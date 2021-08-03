import { NotEnoughStockException } from '../exceptions';
import { Product } from '../models';

type Input = {
  product: Product;
  quantity: number;
};

export const checkStocks = (inputs: Input[]): void => {
  for (const { product, quantity } of inputs) {
    if (product.stockThreshold < quantity) {
      throw new NotEnoughStockException(product, quantity);
    }
  }
};
