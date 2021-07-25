import { BadRequestException } from '@nestjs/common';

import { Product } from '../models';

export class NotEnoughStockException extends BadRequestException {
  constructor(product: Product, required: number) {
    const { stockThreshold, item, itemOptionValues } = product;

    const name = `${item.name}(${itemOptionValues
      .map(({ name }) => name)
      .join('/')}`;

    super(
      `${name}의 재고가 부족합니다. (요청됨: ${required}, 재고: ${stockThreshold}`
    );
  }
}
