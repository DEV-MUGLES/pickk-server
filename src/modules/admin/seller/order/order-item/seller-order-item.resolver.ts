import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

import {
  OrderItemRelationType,
  ORDER_ITEM_RELATIONS,
} from '@order/order-items/constants';
import { OrderItemFilter, ShipOrderItemInput } from '@order/order-items/dtos';
import { OrderItem } from '@order/order-items/models';
import { OrderItemsService } from '@order/order-items/order-items.service';
import { OrdersService } from '@order/orders/orders.service';
import { CancelPaymentInput } from '@payment/payments/dtos';
import { PaymentsService } from '@payment/payments/payments.service';

import {
  BulkShipOrderItemInput,
  CancelMeSellerOrderItemInput,
  OrderItemsCountOutput,
} from './dtos';

import { SellerOrderItemService } from './seller-order-item.service';

@Injectable()
export class SellerOrderItemResolver extends BaseResolver<OrderItemRelationType> {
  relations = ORDER_ITEM_RELATIONS;

  constructor(
    @Inject(OrderItemsService)
    private readonly orderItemsService: OrderItemsService,
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
    @Inject(PaymentsService)
    private readonly paymentsService: PaymentsService,
    @Inject(SellerOrderItemService)
    private readonly sellerOrderItemService: SellerOrderItemService,
    @Inject(CacheService) private cacheService: CacheService
  ) {
    super();
  }

  @Query(() => [OrderItem])
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerOrderItems(
    @CurrentUser() { sellerId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo,
    @Args('orderItemFilter', { nullable: true })
    filter?: OrderItemFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<OrderItem[]> {
    return await this.orderItemsService.list(
      {
        sellerId,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => OrderItemsCountOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerOrderItemsCount(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('forceUpdate', { nullable: true }) forceUpdate?: boolean
  ): Promise<OrderItemsCountOutput> {
    if (!forceUpdate) {
      const cached = await this.cacheService.get<OrderItemsCountOutput>(
        OrderItemsCountOutput.getCacheKey(sellerId)
      );

      if (cached) {
        return new OrderItemsCountOutput(cached);
      }
    }

    const count = await this.sellerOrderItemService.getCount(sellerId);

    await this.cacheService.set<OrderItemsCountOutput>(count.cacheKey, count, {
      ttl: 60 * 5,
    });

    return count;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtSellerVerifyGuard)
  async bulkShipReadyMeSellerOrderItems(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUids', { type: () => [String] })
    merchantUids: string[]
  ): Promise<boolean> {
    await this.sellerOrderItemService.bulkShipReady(sellerId, merchantUids);

    return true;
  }

  @Mutation(() => OrderItem)
  @UseGuards(JwtSellerVerifyGuard)
  async shipMeSellerOrderItem(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('shipOrderItemInput') input: ShipOrderItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemsService.get(merchantUid);
    if (orderItem.sellerId !== sellerId) {
      throw new ForbiddenException('자신의 주문 상품이 아닙니다.');
    }

    await this.sellerOrderItemService.ship(orderItem, input);

    return await this.orderItemsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtSellerVerifyGuard)
  async bulkShipMeSellerOrderItems(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('bulkShipOrderItemInput')
    { shipOrderItemInputs }: BulkShipOrderItemInput
  ): Promise<boolean> {
    const merchantUids = shipOrderItemInputs.map((input) => input.merchantUid);

    const orderItems = await this.orderItemsService.list({
      merchantUidIn: merchantUids,
    });
    if (orderItems.some((oi) => oi.sellerId !== sellerId)) {
      const { merchantUid } = orderItems.find((oi) => oi.sellerId !== sellerId);

      throw new ForbiddenException(
        `자신의 주문 상품이 아닙니다. (${merchantUid})`
      );
    }

    await this.sellerOrderItemService.bulkShip(orderItems, shipOrderItemInputs);

    return true;
  }

  @Mutation(() => OrderItem)
  @UseGuards(JwtSellerVerifyGuard)
  async cancelMeSellerOrderItem(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('merchantUid') merchantUid: string,
    @Args('cancelMeSellerOrderItemInput')
    input: CancelMeSellerOrderItemInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemsService.get(merchantUid);
    if (orderItem.sellerId !== sellerId) {
      throw new ForbiddenException('자신의 주문 상품이 아닙니다.');
    }

    const order = await this.ordersService.get(orderItem.orderMerchantUid, [
      'orderItems',
      'orderItems.product',
      'orderItems.product.item',
      'orderItems.product.item.brand',
      'orderItems.product.item.brand.seller',
      'orderItems.product.item.brand.seller.shippingPolicy',
      'vbankInfo',
    ]);
    const cancelledOrder = await this.ordersService.cancel(
      order,
      [merchantUid],
      input.amount,
      input.checksum
    );

    const payment = await this.paymentsService.get(merchantUid);
    await this.paymentsService.cancel(
      payment,
      CancelPaymentInput.of(cancelledOrder, input)
    );

    return await this.orderItemsService.get(
      merchantUid,
      this.getRelationsFromInfo(info)
    );
  }
}
