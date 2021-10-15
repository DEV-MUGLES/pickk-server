import { IExchangeRequest } from '@order/exchange-requests/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { IRefundRequest } from '@order/refund-requests/interfaces';

export const getDelayedCountDatas = (
  delayeds: Array<IOrderItem | IExchangeRequest | IRefundRequest>
) => {
  return Object.values(
    delayeds.reduce<{
      [sellerId: number]: {
        brandKor: string;
        phoneNumber: string;
        delayedCount: number;
      };
    }>(
      (result, v) => ({
        ...result,
        [v.sellerId]: {
          brandKor: v.seller.brand.nameKor,
          phoneNumber: v.seller.orderNotiPhoneNumber,
          delayedCount: (result[v.sellerId]?.delayedCount ?? 0) + 1,
        },
      }),
      {}
    )
  );
};
