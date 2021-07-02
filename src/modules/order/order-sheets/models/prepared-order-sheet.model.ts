import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models/coupon.model';
import { RefundAccount, ShippingAddress } from '@user/users/models';
import { Brand } from '@item/brands/models/brand.model';
import { SellerShippingPolicy } from '@item/sellers/models/policies/seller-shipping-policy.model';
import { Product } from '@item/products/models/product.model';

@ObjectType()
export class PreparedOrderSheetItem {
  @Field(() => Int)
  quantity: number;

  @Field(() => Product)
  product: Product;
}

@ObjectType()
export class PreparedOrderSheetBrand {
  @Field(() => Brand)
  brand: Brand;

  @Field(() => [PreparedOrderSheetItem])
  orderSheetItems: PreparedOrderSheetItem[];

  @Field(() => SellerShippingPolicy)
  sellerShippingPolicy: SellerShippingPolicy;

  constructor(attributes?: Partial<PreparedOrderSheetBrand>) {
    if (!attributes) {
      return;
    }

    this.brand = attributes.brand;
    this.orderSheetItems = attributes.orderSheetItems;
    this.sellerShippingPolicy = attributes.sellerShippingPolicy;
  }
}

@ObjectType()
export class PreparedOrderSheet {
  @Field(() => Int, { description: '요청한 유저의 ID와 동일한 값입니다.' })
  id: number;

  @Field(() => [PreparedOrderSheetBrand], {
    description: 'OrderSheetItem들을 브랜드별로 묶은 단위입니다.',
  })
  orderSheetBrands: PreparedOrderSheetBrand[];

  @Field(() => [PreparedOrderSheetItem])
  orderSheetItems: PreparedOrderSheetItem[];

  @Field(() => Int)
  availablePointAmount: number;

  @Field(() => [Coupon])
  availableCoupons: Coupon[];

  @Field(() => [ShippingAddress])
  shippingAddresses: ShippingAddress;

  @Field(() => RefundAccount)
  refundAccount: RefundAccount;
}
