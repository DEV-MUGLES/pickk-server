import { Product } from '@item/products/models/product.model';
import { Coupon } from '@order/coupons/models';
import { RefundAccount, ShippingAddress } from '@user/users/models';

import { BaseOrderSheetProductInput } from '../dtos';
import {
  BaseOrderSheet,
  BaseOrderSheetBrand,
  BaseOrderSheetItem,
} from '../models';
import { AbstractOrderSheetBuilder } from './abstract-order-sheet.builder';

export class BaseOrderSheetBuilder extends AbstractOrderSheetBuilder {
  constructor(
    readonly userId: number,
    readonly products: Product[],
    readonly productInputs: BaseOrderSheetProductInput[],
    private readonly availablePointAmount: number,
    private readonly availableCoupons: Coupon[],
    private readonly shippingAddresses: ShippingAddress[],
    private readonly refundAccount?: RefundAccount
  ) {
    super();
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
    } = this;

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
