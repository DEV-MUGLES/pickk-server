import { UseGuards } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtPayload } from '@auth/dtos';
import { JwtVerifyGuard } from '@auth/guards';
import { PRODUCT_RELATIONS } from '@item/products/constants';
import { ProductsService } from '@item/products/products.service';
import { PointsService } from '@order/points/points.service';
import { CouponsService } from '@order/coupons/coupons.service';
import { UsersService } from '@user/users/users.service';

import { BaseOrderSheetBuilder } from './builders';
import { BaseOrderSheetInput, OrderSheetInput } from './dtos';
import { BaseOrderSheet, OrderSheet } from './models';

import { OrderSheetsService } from './order-sheets.service';

@Injectable()
export class OrderSheetsResolver {
  constructor(
    @Inject(OrderSheetsService)
    private readonly orderSheetsService: OrderSheetsService,
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
    @Inject(PointsService)
    private readonly pointsService: PointsService,
    @Inject(CouponsService)
    private readonly couponsService: CouponsService,
    @Inject(UsersService)
    private readonly usersService: UsersService
  ) {}

  @Query(() => BaseOrderSheet)
  @UseGuards(JwtVerifyGuard)
  async prepareOrder(
    @CurrentUser() payload: JwtPayload,
    @Args('prepareOrderSheetInput')
    { productInputs }: BaseOrderSheetInput
  ): Promise<BaseOrderSheet> {
    const userId = payload.sub;
    const user = await this.usersService.get(userId, [
      'shippingAddresses',
      'refundAccount',
    ]);

    const productIds = productInputs.map((input) => input.productId);
    const productRelations = PRODUCT_RELATIONS.filter(
      (relation) =>
        relation !== 'item.detailImages' && relation !== 'item.options'
    );

    const { refundAccount } = user;
    const [
      products,
      availablePointAmount,
      availableCoupons,
      shippingAddresses,
    ] = await Promise.all([
      this.productsService.list({ idIn: productIds }, null, productRelations),
      this.pointsService.getAvailableAmount(userId),
      this.couponsService.list({ userId }, null, ['spec', 'spec.brand']),
      this.usersService.getShippingAddresses(user),
    ]);

    return new BaseOrderSheetBuilder(
      userId,
      products,
      productInputs,
      availablePointAmount,
      availableCoupons,
      shippingAddresses,
      refundAccount
    )
      .validate()
      .build();
  }

  @Query(() => OrderSheet)
  @UseGuards(JwtVerifyGuard)
  async createOrderSheet(
    @CurrentUser() payload: JwtPayload,
    @Args('orderSheetInput')
    orderSheetInput: OrderSheetInput
  ): Promise<OrderSheet> {
    const baseOrderSheet = await this.prepareOrder(payload, orderSheetInput);
    OrderSheetInput.validate(orderSheetInput, baseOrderSheet);

    return await this.orderSheetsService.create(payload.sub, orderSheetInput);
  }
}
