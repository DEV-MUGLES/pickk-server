import { UseGuards } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/dto/jwt.dto';
import { JwtVerifyGuard } from '@auth/guards';
import { PRODUCT_RELATIONS } from '@item/products/constants/product.relation';
import { ProductsService } from '@item/products/products.service';
import { PointsService } from '@order/points/points.service';
import { CouponsService } from '@order/coupons/coupons.service';
import { UsersService } from '@user/users/users.service';

import { PrepareOrderSheetInput } from './dtos';
import { BaseOrderSheet } from './models';
import { BaseOrderSheetBuilder } from './builders/base-order-sheet.builder';

@Injectable()
export class OrderSheetsResolver {
  constructor(
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
    { productInputs }: PrepareOrderSheetInput
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

    return new BaseOrderSheetBuilder({
      userId,
      products,
      productInputs,
      availablePointAmount,
      availableCoupons,
      shippingAddresses,
      refundAccount,
    })
      .validate()
      .build();
  }
}
