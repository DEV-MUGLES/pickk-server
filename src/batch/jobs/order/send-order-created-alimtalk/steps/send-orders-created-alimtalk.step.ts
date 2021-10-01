import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';

import { AlimtalkService } from '@providers/sens';
import { OrderItemStatus } from '@order/order-items/constants';

@Injectable()
export class SendOrdersCreatedAlimtalkStep extends BaseStep {
  constructor(private readonly alimtalkService: AlimtalkService) {
    super();
  }

  async tasklet() {
    const runner = getConnection().createQueryRunner();
    const ordersCountBySeller = await runner.query(`
      SELECT sum(orderCountData.count) as ordersCount, orderCountData.brandKor, orderCountData.phoneNumber
      FROM(
        SELECT count(oi.orderMerchantUid) as count, b.nameKor as brandKor, s.phoneNumber, oi.sellerId
        FROM order_item as oi        
        JOIN seller as s
          ON s.id=oi.sellerId
        JOIN brand as b
          ON b.id=s.brandId
        WHERE oi.status='${OrderItemStatus.Paid}'
        GROUP BY oi.orderMerchantUid, oi.sellerId
      ) as orderCountData
      GROUP BY orderCountData.sellerId;
    `);
    runner.release();
    for (const { brandKor, phoneNumber, ordersCount } of ordersCountBySeller) {
      await this.alimtalkService.sendOrdersCreated(
        {
          brandKor,
          phoneNumber,
        },
        ordersCount
      );
    }
  }
}
