import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/models';
import { JwtVerifyGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { CART_ITEM_RELATIONS } from '@item/carts/constants';
import { CartsService } from '@item/carts/carts.service';
import { PRODUCT_RELATIONS } from '@item/products/constants';
import { ProductsService } from '@item/products/products.service';
import { CouponStatus } from '@order/coupons/constants';
import { CouponsService } from '@order/coupons/coupons.service';
import { PointsService } from '@order/points/points.service';
import { PaymentsService } from '@payment/payments/payments.service';
import { PaymentStatus, PayMethod } from '@payment/payments/constants';
import { UsersService } from '@user/users/users.service';

import { OrderRelationType, ORDER_RELATIONS } from './constants';
import {
  RegisterOrderInput,
  BaseOrderOutput,
  StartOrderInput,
  CreateOrderVbankReceiptInput,
} from './dtos';
import { OrderSheet } from './models';
import { OrdersProducer } from './producers';

import { OrdersService } from './orders.service';

@Injectable()
export class OrdersCreateResolver extends BaseResolver<OrderRelationType> {
  relations = ORDER_RELATIONS;

  constructor(
    private readonly couponsService: CouponsService,
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly pointsService: PointsService,
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
    private readonly ordersProducer: OrdersProducer
  ) {
    super();
  }

  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async registerOrder(
    @CurrentUser() payload: JwtPayload,
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
      const cartItemRelations = CART_ITEM_RELATIONS.filter(
        (relation) => relation !== 'user'
      );
      const cartItems = await this.cartsService.list(
        { idIn: cartItemIds },
        null,
        cartItemRelations
      );

      return await this.ordersService.register(payload.sub, cartItems);
    } else {
      const productIds = orderItemInputs.map((input) => input.productId);
      const productRelations = PRODUCT_RELATIONS.filter(
        (relation) =>
          relation !== 'item.detailImages' && relation !== 'item.options'
      );
      const products = await this.productsService.list(
        { idIn: productIds },
        null,
        productRelations
      );
      const inputs = products.map((product) => ({
        product,
        quantity: orderItemInputs.find(
          (orderItemInput) => orderItemInput.productId === product.id
        ).quantity,
      }));

      return await this.ordersService.register(payload.sub, inputs);
    }
  }

  @Query(() => OrderSheet)
  @UseGuards(JwtVerifyGuard)
  async checkoutOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<OrderSheet> {
    const [order, user, availablePointAmount, coupons] = await Promise.all([
      this.ordersService.get(merchantUid, [
        'orderItems',
        'orderItems.seller',
        'orderItems.seller.shippingPolicy',
      ]),
      this.usersService.get(userId),
      this.pointsService.getAvailableAmount(userId),
      this.couponsService.list({ userId, status: CouponStatus.Ready }, null, [
        'spec',
      ]),
    ]);

    return OrderSheet.from(order, user, availablePointAmount, coupons);
  }

  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async startOrder(
    @Args('merchantUid') merchantUid: string,
    @Args('startOrderInput') startOrderInput: StartOrderInput
  ): Promise<BaseOrderOutput> {
    return await this.ordersService.start(merchantUid, startOrderInput);
  }

  @Mutation(() => BaseOrderOutput)
  @UseGuards(JwtVerifyGuard)
  async failOrder(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('merchantUid') merchantUid: string
  ): Promise<BaseOrderOutput> {
    const order = await this.ordersService.get(merchantUid, ['orderItems']);
    if (order.userId !== userId) {
      throw new ForbiddenException('자신의 주문건만 실패처리할 수 있습니다.');
    }

    const failedOrder = await this.ordersService.fail(order);
    await this.ordersProducer.restoreDeductedProductStock(failedOrder);

    return failedOrder;
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
    const order = await this.ordersService.get(merchantUid, [
      'orderItems',
      'vbankInfo',
    ]);
    if (order.userId !== userId) {
      throw new ForbiddenException('자신의 주문이 아닙니다.');
    }

    const { status } = await this.paymentsService.get(merchantUid);
    const paymentStatusMustBe =
      order.payMethod === PayMethod.Vbank
        ? PaymentStatus.VbankReady
        : PaymentStatus.Paid;
    if (status !== paymentStatusMustBe) {
      throw new BadRequestException('결제가 정상적으로 처리되지 않았습니다.');
    }

    return await this.ordersService.complete(
      order,
      createOrderVbankReceiptInput
    );
  }
}
