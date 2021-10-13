import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { getConnection } from 'typeorm';

import { BaseStep } from '@batch/jobs/base.step';
import { Timezone } from '@common/constants';
import { AlimtalkService } from '@providers/sens';

import { OrderItemStatus } from '@order/order-items/constants';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class SendOrdersCreatedAlimtalkStep extends BaseStep {
  constructor(private readonly alimtalkService: AlimtalkService) {
    super();
  }

  async tasklet() {
    const [start, end] = this.getTimeRanges();
    const runner = getConnection().createQueryRunner();
    const ordersCountBySeller = await runner.query(`
      SELECT sum(orderCountData.count) as ordersCount, orderCountData.brandKor, orderCountData.phoneNumber
      FROM(
        SELECT count(oi.orderMerchantUid) as count, b.nameKor as brandKor, s.orderNotiPhoneNumber as phoneNumber, oi.sellerId
        FROM order_item as oi
        JOIN seller as s
          ON s.id=oi.sellerId
        JOIN brand as b
          ON b.id=s.brandId
        WHERE oi.status='${OrderItemStatus.Paid}'
        AND oi.claimStatus is null
        AND oi.createdAt BETWEEN '${start}' AND '${end}'
        GROUP BY oi.orderMerchantUid, oi.sellerId
      ) as orderCountData
      GROUP BY orderCountData.sellerId;
    `);
    runner.release();

    if (ordersCountBySeller.length === 0) {
      return;
    }

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

  private getTimeRanges(): [string, string] {
    const current = dayjs();
    const hourDiff = this.is10oclock() ? 19 : 5;

    if (this.isMonday() && this.is10oclock()) {
      return [
        current
          .subtract(2, 'day')
          .subtract(hourDiff, 'hour')
          .format('YYYY-MM-DD hh:mm:ss'),
        current.format('YYYY-MM-DD hh:mm:ss'),
      ];
    }
    return [
      current.subtract(hourDiff, 'hour').format('YYYY-MM-DD hh:mm:ss'),
      current.format('YYYY-MM-DD hh:mm:ss'),
    ];
  }

  private isMonday(): boolean {
    return dayjs().tz(Timezone.Seoul).get('day') === 1;
  }

  private is10oclock(): boolean {
    return dayjs().tz(Timezone.Seoul).get('hour') === 10;
  }
}
