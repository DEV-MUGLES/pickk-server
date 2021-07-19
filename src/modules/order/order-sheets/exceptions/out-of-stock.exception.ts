import { BadRequestException } from '@nestjs/common';

import { Product } from '@item/products/models';

export class ProductOutOfStockException extends BadRequestException {
  constructor(product: Product, requiredQuantity: number) {
    const itemName = product.item.name;
    const optionString = product.itemOptionValues
      .map((optionValue) => optionValue.name)
      .join('/');

    super(
      `${itemName}(${optionString})의 재고가 부족합니다.\n(잔여: ${product.stockThreshold}, 요청됨: ${requiredQuantity})`
    );
  }
}
