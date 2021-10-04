import * as faker from 'faker';

import { Product } from '@item/products/models/product.model';

import { CartItem } from './cart-item.model';
import { Item } from '@item/items/models';

describe('CartItem', () => {
  describe('adjustQuantityToStock', () => {
    it('성공적으로 수행한다.', () => {
      const [stock, quantity] = [
        faker.datatype.number(),
        faker.datatype.number(),
      ].sort((a, b) => a - b);

      const cartItem = new CartItem({
        quantity: quantity + 1,
        product: new Product({
          stock,
          item: new Item({ isInfiniteStock: false }),
        }),
      });

      expect(cartItem.quantity).toBeGreaterThan(
        cartItem.product.stockThreshold
      );
      expect(cartItem.adjustQuantityToStock()).toEqual(true);
      expect(cartItem.quantity).toEqual(stock);
    });

    it('수행하지 않으면 false를 반환한다.', () => {
      const [quantity, stock] = [
        faker.datatype.number(),
        faker.datatype.number(),
      ].sort((a, b) => a - b);

      const cartItem = new CartItem({
        quantity,
        product: new Product({
          stock: stock + 1,
          item: new Item({ isInfiniteStock: false }),
        }),
      });

      expect(cartItem.quantity).toBeLessThan(cartItem.product.stockThreshold);
      expect(cartItem.adjustQuantityToStock()).toEqual(false);
      expect(cartItem.quantity).toEqual(quantity);
    });
  });
});
