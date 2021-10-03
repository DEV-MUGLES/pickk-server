import { OrderBuyerInput } from '@order/orders/dtos';

export class SaveBuyerInfoMto {
  userId: number;

  buyerInput: OrderBuyerInput;
}
