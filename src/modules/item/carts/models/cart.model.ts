import { Field, ObjectType } from '@nestjs/graphql';

import { Brand } from '../../brands/models/brand.model';
import { SellerShippingPolicy } from '../../sellers/models/policies/seller-shipping-policy.model';
import { CartItem } from './cart-item.model';

@ObjectType()
export class CartBrand {
  @Field(() => Brand)
  brand: Brand;

  @Field(() => [CartItem])
  cartItems: CartItem[];

  @Field(() => SellerShippingPolicy)
  sellerShippingPolicy: SellerShippingPolicy;

  constructor(attributes?: Partial<CartBrand>) {
    if (!attributes) {
      return;
    }

    this.brand = attributes.brand;
    this.cartItems = attributes.cartItems;
    this.sellerShippingPolicy = attributes.sellerShippingPolicy;
  }

  public static create(
    brand: Brand,
    cartItems: CartItem[],
    sellerShippingPolicy: SellerShippingPolicy
  ): CartBrand {
    return new CartBrand({
      brand,
      cartItems,
      sellerShippingPolicy,
    });
  }
}

@ObjectType()
export class Cart {
  @Field(() => [CartBrand])
  cartBrands: CartBrand[];

  @Field(() => [CartItem])
  cartItems: CartItem[];

  constructor(attributes?: Partial<Cart>) {
    if (!attributes) {
      return;
    }

    this.cartBrands = attributes.cartBrands;
    this.cartItems = attributes.cartItems;
  }

  public static create(cartItems: CartItem[]): Cart {
    const cartBrands = Cart.createCartBrands(cartItems);

    return new Cart({
      cartBrands,
      cartItems,
    });
  }

  private static createCartBrands(cartItems: CartItem[]): CartBrand[] {
    const brandItemsObj: { [brandId: number]: CartBrand } = {};
    cartItems.forEach((cartItem) => {
      const {
        product: {
          item: { brand },
        },
      } = cartItem;

      if (!brandItemsObj[brand.id]) {
        brandItemsObj[brand.id] = {
          brand,
          cartItems: [],
          sellerShippingPolicy: brand.seller.shippingPolicy,
        };
      }

      brandItemsObj[brand.id].cartItems.push(cartItem);
    });
    return Object.values(
      brandItemsObj
    ).map(({ brand, cartItems, sellerShippingPolicy }) =>
      CartBrand.create(brand, cartItems, sellerShippingPolicy)
    );
  }
}
