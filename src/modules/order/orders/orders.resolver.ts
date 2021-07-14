import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';

import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';
import { ProductsService } from '@item/products/products.service';
import { OrderSheetsService } from '@order/order-sheets/order-sheets.service';

@Injectable()
export class OrdersResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly orderSheetsService: OrderSheetsService
  ) {}

  @Mutation(() => Boolean, {
    description:
      '입력된 정보를 기반으로 OrderSheet을 찾아낸 뒤, 재고 검사 및 차감을 수행합니다.',
  })
  @UseGuards(JwtAuthGuard)
  async prepareOrder(
    @IntArgs('userId') userId: number,
    @Args('orderSheetUuid') orderSheetUuid: string
  ): Promise<boolean> {
    const orderSheet = await this.orderSheetsService.get(
      userId,
      orderSheetUuid
    );
    await this.productsService.bulkDestock(orderSheet.productDatas);
    return true;
  }
}
