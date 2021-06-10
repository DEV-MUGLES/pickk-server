import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Brand } from '../../brands/models/brand.model';
import { Item } from '../../items/models/item.model';
import { SellerShippingPolicy } from '../../sellers/models/policies/seller-shipping-policy.model';
import { CartItem } from './cart-item.model';

type CartBrandAmount = Pick<
  CartBrand,
  'shippingFee' | 'minimumAmountForFree' | 'totalItemPrice' | 'totalAmount'
>;

@ObjectType()
export class CartBrand {
  @Field(() => Brand)
  brand: Brand;

  @Field(() => [CartItem])
  cartItems: CartItem[];

  @Field(() => Int, {
    description: '부과된 배송비입니다. 무료배송인 경우 0입니다.',
  })
  shippingFee: number;

  @Field(() => Int)
  minimumAmountForFree: number;

  @Field(() => Int)
  totalItemPrice: number;

  @Field(() => Int)
  totalAmount: number;

  constructor(attributes?: Partial<CartBrand>) {
    if (!attributes) {
      return;
    }

    this.brand = attributes.brand;
    this.cartItems = attributes.cartItems;

    this.shippingFee = attributes.shippingFee;
    this.minimumAmountForFree = attributes.minimumAmountForFree;
    this.totalItemPrice = attributes.totalItemPrice;
    this.totalAmount = attributes.totalAmount;
  }

  public static create(brand: Brand, cartItems: CartItem[]): CartBrand {
    return new CartBrand({
      brand,
      cartItems,
      ...this.getAmount(brand.seller.shippingPolicy, cartItems),
    });
  }

  private static getAmount(
    shippingPolicy: SellerShippingPolicy,
    cartItems: CartItem[]
  ): CartBrandAmount {
    const totalItemPrice = cartItems.reduce((acc, cartItem) => {
      const item = new Item(cartItem.product.item);
      return acc + item.finalPrice * cartItem.quantity;
    }, 0);
    const { fee, minimumAmountForFree } = shippingPolicy;
    const shippingFee = totalItemPrice > minimumAmountForFree ? 0 : fee;

    return {
      shippingFee,
      minimumAmountForFree,
      totalItemPrice,
      totalAmount: totalItemPrice + shippingFee,
    };
  }
}

type CartAmount = Pick<
  Cart,
  'totalShippingFee' | 'totalItemPrice' | 'totalAmount'
>;

@ObjectType()
export class Cart {
  @Field(() => Int)
  id: number;

  @Field(() => [CartBrand])
  cartBrands: CartBrand[];

  @Field(() => [CartItem])
  cartItems: CartItem[];

  @Field(() => Int)
  totalShippingFee: number;

  @Field(() => Int)
  totalItemPrice: number;

  @Field(() => Int)
  totalAmount: number;

  constructor(attributes?: Partial<Cart>) {
    if (!attributes) {
      return;
    }

    this.id = attributes.id;

    this.cartBrands = attributes.cartBrands;
    this.cartItems = attributes.cartItems;

    this.totalShippingFee = attributes.totalShippingFee;
    this.totalItemPrice = attributes.totalItemPrice;
    this.totalAmount = attributes.totalAmount;
  }

  public static create(userId: number, cartItems: CartItem[]): Cart {
    const cartBrands = Cart.createCartBrands(cartItems);
    const amount = Cart.getAmount(cartBrands);

    return new Cart({
      id: userId,
      cartBrands,
      cartItems,
      ...amount,
    });
  }

  private static createCartBrands(cartItems: CartItem[]): CartBrand[] {
    const brandItemsObj = {};
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
        };
      }

      brandItemsObj[brand.id].cartItems.push(cartItem);
    });
    return Object.values(brandItemsObj).map(({ brand, cartItems }) =>
      CartBrand.create(brand, cartItems)
    );
  }

  private static getAmount(cartBrands: CartBrand[]): CartAmount {
    return cartBrands.reduce(
      (acc, cartBrand) => ({
        totalShippingFee: acc.totalShippingFee + cartBrand.shippingFee,
        totalItemPrice: acc.totalItemPrice + cartBrand.totalItemPrice,
        totalAmount: acc.totalAmount + cartBrand.totalAmount,
      }),
      {
        totalShippingFee: 0,
        totalItemPrice: 0,
        totalAmount: 0,
      } as CartAmount
    );
  }
}
