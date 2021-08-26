import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { OrderVbankReceipt } from '../models';

// @FIXME: graphQL Arg nullbale true 옵션을 적용하였는데도, classValidator를 수행하는 문제가 있어, 임시방편으로 partialType을 하였으나 추후에 고쳐야합니다.
@InputType()
export class CreateOrderVbankReceiptInput extends PartialType(
  PickType(
    OrderVbankReceipt,
    ['bankCode', 'number', 'ownerName', 'due'],
    InputType
  )
) {}
