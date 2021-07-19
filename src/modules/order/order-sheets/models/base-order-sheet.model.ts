import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Brand } from '@item/brands/models';
import { SellerShippingPolicy } from '@item/sellers/models';
import { Product } from '@item/products/models';
import { Coupon } from '@order/coupons/models';
import { RefundAccount, ShippingAddress } from '@user/users/models';

@ObjectType()
export class BaseOrderSheetItem {
  @Field(() => Int)
  quantity: number;

  @Field(() => Product)
  product: Product;

  constructor(attributes?: Partial<BaseOrderSheetItem>) {
    if (!attributes) {
      return;
    }

    this.quantity = attributes.quantity;
    this.product = attributes.product;
  }
}

@ObjectType()
export class BaseOrderSheetBrand {
  @Field(() => Brand)
  brand: Brand;

  @Field(() => [BaseOrderSheetItem])
  orderSheetItems: BaseOrderSheetItem[];

  @Field(() => SellerShippingPolicy)
  sellerShippingPolicy: SellerShippingPolicy;

  constructor(attributes?: Partial<BaseOrderSheetBrand>) {
    if (!attributes) {
      return;
    }

    this.brand = attributes.brand;
    this.orderSheetItems = attributes.orderSheetItems;
    this.sellerShippingPolicy = attributes.sellerShippingPolicy;
  }
}

@ObjectType()
export class BaseOrderSheet {
  @Field(() => Int, { description: '요청한 유저의 ID와 동일한 값입니다.' })
  id: number;

  @Field(() => [BaseOrderSheetBrand], {
    description: 'OrderSheetItem들을 브랜드별로 묶은 단위입니다.',
  })
  orderSheetBrands: BaseOrderSheetBrand[];

  @Field(() => [BaseOrderSheetItem])
  orderSheetItems: BaseOrderSheetItem[];

  @Field(() => Int)
  availablePointAmount: number;

  @Field(() => [Coupon])
  availableCoupons: Coupon[];

  @Field(() => [ShippingAddress])
  shippingAddresses: ShippingAddress[];

  @Field(() => RefundAccount)
  refundAccount?: RefundAccount;

  constructor(attributes?: Partial<BaseOrderSheet>) {
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.orderSheetBrands = attributes.orderSheetBrands;
    this.orderSheetItems = attributes.orderSheetItems;
    this.availablePointAmount = attributes.availablePointAmount;
    this.availableCoupons = attributes.availableCoupons;
    this.shippingAddresses = attributes.shippingAddresses;
    this.refundAccount = attributes.refundAccount;
  }
}
