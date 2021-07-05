import { BadRequestException } from '@nestjs/common';

import { Product } from '@item/products/models/product.model';
import { Coupon } from '@order/coupons/models/coupon.model';
import { RefundAccount, ShippingAddress } from '@user/users/models';

import { PrepareOrderSheetProductInput } from '../dtos';
import { ProductOutOfStockException } from '../exceptions/out-of-stock.exception';
import {
  BaseOrderSheet,
  BaseOrderSheetBrand,
  BaseOrderSheetItem,
} from '../models';

export class BaseOrderSheetBuilder {
  constructor(
    private readonly data: {
      userId: number;
      products: Product[];
      productInputs: PrepareOrderSheetProductInput[];
      availablePointAmount: number;
      availableCoupons: Coupon[];
      shippingAddresses: ShippingAddress[];
      refundAccount?: RefundAccount;
    }
  ) {}

  validate(): BaseOrderSheetBuilder {
    this.checkProducts();
    this.checkStocks();
    return this;
  }

  /** 입력된 모든 products가 productInputs에 mapping 되어야한다. */
  private checkProducts() {
    const { products, productInputs } = this.data;

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
  private checkStocks() {
    const { products, productInputs } = this.data;

    products.forEach((product) => {
      const productInput = productInputs.find(
        (input) => input.productId === product.id
      );

      if (productInput.quantity > product.stockThreshold) {
        throw new ProductOutOfStockException(product, productInput.quantity);
      }
    });
  }

  build(): BaseOrderSheet {
    const {
      products,
      productInputs,
      userId,
      availablePointAmount,
      availableCoupons,
      shippingAddresses,
      refundAccount,
    } = this.data;

    const orderSheetItems: BaseOrderSheetItem[] = productInputs.map((input) => {
      const product = products.find(({ id }) => id === input.productId);
      return new BaseOrderSheetItem({ product, quantity: input.quantity });
    });
    const orderSheetBrands = this.createOrderSheetBrands(orderSheetItems);

    return new BaseOrderSheet({
      id: userId,
      orderSheetBrands,
      orderSheetItems,
      availablePointAmount,
      availableCoupons,
      shippingAddresses,
      refundAccount,
    });
  }

  private createOrderSheetBrands(
    orderSheetItems: BaseOrderSheetItem[]
  ): BaseOrderSheetBrand[] {
    const brandItemsObj: { [brandId: number]: BaseOrderSheetBrand } = {};
    orderSheetItems.forEach((orderSheetItem) => {
      const {
        product: {
          item: { brand },
        },
      } = orderSheetItem;

      if (!brandItemsObj[brand.id]) {
        brandItemsObj[brand.id] = {
          brand,
          orderSheetItems: [],
          sellerShippingPolicy: brand.seller.shippingPolicy,
        };
      }

      brandItemsObj[brand.id].orderSheetItems.push(orderSheetItem);
    });
    return Object.values(brandItemsObj).map(
      ({ brand, orderSheetItems, sellerShippingPolicy }) =>
        new BaseOrderSheetBrand({
          brand,
          orderSheetItems,
          sellerShippingPolicy,
        })
    );
  }
}
