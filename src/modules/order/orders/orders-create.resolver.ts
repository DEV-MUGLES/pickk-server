import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { JwtVerifyGuard } from '@auth/guards';
import { BaseResolver, DerivedFieldsInfoType } from '@common/base.resolver';

import { REGISTER_ORDER_CART_ITEM_RELATIONS } from '@item/carts/constants';
import { CartsService } from '@item/carts/carts.service';
import { REGISTER_ORDER_PRODUCT_RELATIONS } from '@item/products/constants';
import { ProductsService } from '@item/products/products.service';
import { CouponStatus } from '@order/coupons/constants';
import { CouponsService } from '@order/coupons/coupons.service';
import { PointsService } from '@order/points/points.service';
import { UsersService } from '@user/users/users.service';

import {
  CHECKOUT_ORDER_RELATIONS,
  OrderRelationType,
  ORDER_RELATIONS,
} from './constants';
import {
  RegisterOrderInput,
  BaseOrderOutput,
  StartOrderInput,
  CreateOrderVbankReceiptInput,
} from './dtos';
import { Order, OrderSheet } from './models';
import { OrdersProducer } from './producers';

import { OrdersService } from './orders.service';

@Injectable()
export class OrdersCreateResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;
  derivedFieldsInfo: DerivedFieldsInfoType = {
    orderItems: ['brands'],
    'orderItems.seller': ['brands'],
    'orderItems.seller.brand': ['brands'],
    'orderItems.seller.shippingPolicy': ['brands'],
  };

  constructor(
    private readonly couponsService: CouponsService,
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly pointsService: PointsService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly ordersProducer: OrdersProducer
  ) {
    super();
  }

  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async registerOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('registerOrderInput')
    { cartItemIds, orderItemInputs }: RegisterOrderInput
  ): Promise<BaseOrderOutput> {
    if (
      (!cartItemIds && !orderItemInputs) ||
      (cartItemIds && orderItemInputs)
    ) {
      throw new BadRequestException(
        'cartItemIds와 orderItemInputs중 하나만 제공되어야합니다.'
      );
    }

    if (cartItemIds) {
      const cartItems = await this.cartsService.list(
        { idIn: cartItemIds },
        null,
        REGISTER_ORDER_CART_ITEM_RELATIONS
      );

      return await this.ordersService.register(userId, cartItems);
    } else {
      const productIds = orderItemInputs.map((input) => input.productId);
      const products = await this.productsService.list(
        { idIn: productIds },
        null,
        REGISTER_ORDER_PRODUCT_RELATIONS
      );
      const inputs = products.map((product) => ({
        product,
        quantity: orderItemInputs.find(
          (orderItemInput) => orderItemInput.productId === product.id
        ).quantity,
      }));

      return await this.ordersService.register(userId, inputs);
    }
  }

  @Query(() => OrderSheet)
  @UseGuards(JwtVerifyGuard)
  async checkoutOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<OrderSheet> {
    const [order, user, availablePointAmount, coupons] = await Promise.all([
      this.ordersService.get(merchantUid, CHECKOUT_ORDER_RELATIONS),
      this.usersService.get(userId),
      this.pointsService.getAvailableAmount(userId),
      this.couponsService.list({ userId, status: CouponStatus.Ready }, null, [
        'spec',
      ]),
    ]);

    return OrderSheet.from(order, user, availablePointAmount, coupons);
  }

  @Mutation(() => Order)
  @UseGuards(JwtVerifyGuard)
  async startOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('startOrderInput') startOrderInput: StartOrderInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Order> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    await this.ordersService.start(merchantUid, startOrderInput);
    return await this.ordersService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async failOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<BaseOrderOutput> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    await this.ordersService.fail(merchantUid);

    const failed = await this.ordersService.get(merchantUid, ['orderItems']);
    await this.ordersProducer.restoreDeductedProductStock(
      failed.orderItems.map((v) => v.merchantUid)
    );

    return failed;
  }

  // @TODO: Queue에서 주문완료 카톡 알림 보내기
  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async completeOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('createOrderVbankReceiptInput', {
      nullable: true,
      description: '가상계좌 주문건인 경우에만 필요합니다.',
    })
    createOrderVbankReceiptInput: CreateOrderVbankReceiptInput
  ): Promise<BaseOrderOutput> {
    await this.ordersService.checkBelongsTo(merchantUid, userId);

    return await this.ordersService.complete(
      merchantUid,
      createOrderVbankReceiptInput
    );
  }
}
