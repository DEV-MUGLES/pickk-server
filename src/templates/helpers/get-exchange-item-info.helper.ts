import { ExchangeRequest } from '@order/exchange-requests/models';

export const getExchangeItemInfo = (exchangeRequest: ExchangeRequest) => {
  const {
    orderItem: { brandNameKor },
    itemName,
    productVariantName,
    quantity,
  } = exchangeRequest;

  return `[${brandNameKor}] ${itemName} (${productVariantName}) ${quantity}개`;
};
