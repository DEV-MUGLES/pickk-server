import {
  Field,
  InputType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import {
  SellerClaimAccount,
  SellerClaimPolicy,
  SellerCrawlPolicy,
  SellerSettleAccount,
  SellerSettlePolicy,
  SellerShippingPolicy,
  SellerCrawlStrategy,
  SellerReturnAddress,
} from '../models';

@InputType()
export class CreateSellerClaimAccountInput extends PickType(
  SellerClaimAccount,
  ['bankCode', 'number', 'ownerName'],
  InputType
) {}

@InputType()
export class CreateSellerClaimPolicyInput extends PickType(
  SellerClaimPolicy,
  [
    'fee',
    'phoneNumber',
    'picName',
    'feePayMethod',
    'isExchangable',
    'isRefundable',
  ],
  InputType
) {
  @Field({ nullable: true })
  accountInput?: CreateSellerClaimAccountInput;
}

@InputType()
export class CreateSellerSettleAccountInput extends PickType(
  SellerSettleAccount,
  ['bankCode', 'number', 'ownerName'],
  InputType
) {}

@InputType()
export class CreateSellerSettlePolicyInput extends PickType(
  SellerSettlePolicy,
  ['email', 'phoneNumber', 'picName', 'rate'],
  InputType
) {
  @Field({ nullable: true, description: '정산 받을 계좌' })
  accountInput?: CreateSellerSettleAccountInput;
}

@InputType()
export class CreateSellerCrawlPolicyInput extends PickType(
  SellerCrawlPolicy,
  ['isInspectingNew', 'isUpdatingItems'],
  InputType
) {}

@InputType()
export class CreateSellerShippingPolicyInput extends PickType(
  SellerShippingPolicy,
  ['minimumAmountForFree', 'fee', 'description'],
  InputType
) {}

@InputType()
export class CreateSellerReturnAddressInput extends PickType(
  SellerReturnAddress,
  ['baseAddress', 'detailAddress', 'postalCode'],
  InputType
) {}

@InputType()
export class CreateSellerCrawlStrategyInput extends PickType(
  SellerCrawlStrategy,
  [
    'itemsSelector',
    'codeRegex',
    'pagination',
    'pageParam',
    'baseUrl',
    'startPathNamesJoin',
  ],
  InputType
) {}

@InputType()
export class UpdateSellerClaimAccountInput extends PartialType(
  CreateSellerClaimAccountInput
) {}

@InputType()
export class UpdateSellerSettleAccountInput extends PartialType(
  CreateSellerSettleAccountInput
) {}

@InputType()
export class UpdateSellerClaimPolicyInput extends PartialType(
  OmitType(CreateSellerClaimPolicyInput, ['accountInput'])
) {
  @Field({ nullable: true })
  accountInput?: UpdateSellerClaimAccountInput;
}

@InputType()
export class UpdateSellerSettlePolicyInput extends PartialType(
  OmitType(CreateSellerSettlePolicyInput, ['accountInput'])
) {
  @Field({ nullable: true })
  accountInput?: UpdateSellerSettleAccountInput;
}

@InputType()
export class UpdateSellerCrawlPolicyInput extends PartialType(
  CreateSellerCrawlPolicyInput
) {}

@InputType()
export class UpdateSellerShippingPolicyInput extends PartialType(
  CreateSellerShippingPolicyInput
) {}

@InputType()
export class UpdateSellerReturnAddressInput extends PartialType(
  CreateSellerReturnAddressInput
) {}
