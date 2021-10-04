import { NotEnoughStockException } from '../exceptions';
import { Product } from '../models';

type Input = {
  product: Product;
  quantity: number;
};

export const checkStocks = (inputs: Input[]): void => {
  for (const { product, quantity } of inputs) {
    if (product.item.isInfiniteStock) {
      // 무한재고인 경우 검사하지 않는다.
      continue;
    }

    if (product.stockThreshold < quantity) {
      throw new NotEnoughStockException(product, quantity);
    }
  }
};
