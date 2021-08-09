import { isArray } from '@common/helpers';

import { OrderItem } from '@order/order-items/models';

export const getPurchaseItemInfo = (input: OrderItem | OrderItem[]) => {
  const { brandNameKor, itemName, productVariantName, quantity } = isArray(
    input
  )
    ? input[0]
    : input;

  return (
    `[${brandNameKor}] ${itemName} (${productVariantName}) ${quantity}개` +
    (isArray(input) && input.length > 1 ? `외 ${input.length - 1}건` : '')
  );
};
