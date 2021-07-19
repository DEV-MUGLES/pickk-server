import { InputType, PartialType, PickType } from '@nestjs/graphql';

import { RefundAccount } from '../models';

@InputType()
export class CreateRefundAccountInput extends PickType(
  RefundAccount,
  ['bankCode', 'number', 'ownerName'],
  InputType
) {}

@InputType()
export class UpdateRefundAccountInput extends PartialType(
  CreateRefundAccountInput
) {}
