import { BadRequestException } from '@nestjs/common';

import { Product } from '@item/products/models/product.model';

import { ProductOutOfStockException } from '../exceptions';

export abstract class AbstactProductInput {
  productId: number;
  quantity: number;
}

export abstract class AbstractOrderSheetBuilder {
  abstract readonly userId: number;
  abstract readonly products: Product[];
  abstract readonly productInputs: AbstactProductInput[];

  public validate(): AbstractOrderSheetBuilder {
    this.checkProducts();
    this.checkStocks();
    return this;
  }

  /** 입력된 모든 products가 productInputs에 mapping 되어야한다. */
  protected checkProducts() {
    const { products, productInputs } = this;

    if (products.length !== productInputs.length) {
      throw new BadRequestException(
        'prepareOrder: 프로덕트 정보가 잘못됐습니다. (length)'
      );
    }

    products.forEach((product) => {
      const productInput = productInputs.find(
        (input) => input.productId === product.id
      );

      if (!productInput) {
        throw new BadRequestException(
          `prepareOrder: 프로덕트 정보를 찾지 못 했습니다. (${product.id})`
        );
      }
    });
  }

  /** 입력된 모든 products가 quantity만큼의 stock을 갖고 있어야한다. */
  protected checkStocks() {
    const { products, productInputs } = this;

    products.forEach((product) => {
      const productInput = productInputs.find(
        (input) => input.productId === product.id
      );

      if (productInput.quantity > product.stockThreshold) {
        throw new ProductOutOfStockException(product, productInput.quantity);
      }
    });
  }

  abstract build();
}
