import {
  Field,
  InputType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import { SellerClaimAccount } from '../models/policies/seller-claim-account.model';
import { SellerClaimPolicy } from '../models/policies/seller-claim-policy.model';
import { SellerCrawlPolicy } from '../models/policies/seller-crawl-policy.model';
import { SellerSettleAccount } from '../models/policies/seller-settle-account.model';
import { SellerSettlePolicy } from '../models/policies/seller-settle-policy.model';
import { SellerShippingPolicy } from '../models/policies/seller-shipping-policy.model';
import { SellerCrawlStrategy } from '../models/seller-crawl-strategy.model';
import { SellerReturnAddress } from '../models/seller-return-address.model';

@InputType()
export class CreateSellerClaimAccountInput extends PickType(
  SellerClaimAccount,
  ['bankCode', 'number', 'ownerName'],
  InputType
) {}

@InputType()
export class CreateSellerClaimPolicyInput extends PickType(
  SellerClaimPolicy,
  ['fee', 'phoneNumber', 'picName', 'feePayMethod'],
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
  ['email', 'phoneNumber', 'picName'],
  InputType
) {
  @Field({ nullable: true })
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
  ['minimumAmountForFree', 'fee'],
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
