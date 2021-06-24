import faker from 'faker';
import { InicisBankCode } from 'inicis';
import { Injectable } from '@nestjs/common';

import { SellersService } from '@item/sellers/sellers.service';
import { CreateSellerInput } from '@item/sellers/dtos/seller.input';
import { FindSaleStrategyInput } from '@common/dtos/sale-strategy.input';
import {
  CreateSellerClaimPolicyInput,
  CreateSellerCrawlPolicyInput,
  CreateSellerCrawlStrategyInput,
  CreateSellerReturnAddressInput,
  CreateSellerShippingPolicyInput,
} from '@item/sellers/dtos/seller-policies.input';
import { ClaimFeePayMethod } from '@item/sellers/constants/seller-claim-policy.enum';

@Injectable()
export class SellersSeeder {
  constructor(private sellersService: SellersService) {}

  async create(userId: number, brandId: number, courierId: number) {
    const saleStrategyInput: FindSaleStrategyInput = {
      canUseCoupon: faker.datatype.boolean(),
      canUseMileage: faker.datatype.boolean(),
    };

    const claimPolicyInput: CreateSellerClaimPolicyInput = {
      fee: faker.datatype.number({ min: 1, max: 5000 }),
      phoneNumber: '010' + faker.datatype.number({ precision: 8 }),
      picName: faker.name.firstName(),
      feePayMethod: faker.datatype.boolean()
        ? ClaimFeePayMethod.Trans
        : ClaimFeePayMethod.Enclose,
      accountInput: {
        bankCode: InicisBankCode.BcCard,
        number: faker.finance.account(14),
        ownerName: faker.name.firstName(),
      },
    };

    const crawlPolicyInput: CreateSellerCrawlPolicyInput = {
      isInspectingNew: faker.datatype.boolean(),
      isUpdatingItems: faker.datatype.boolean(),
    };

    const crawlStrategyInput: CreateSellerCrawlStrategyInput = {
      itemsSelector: faker.datatype.string(10),
      codeRegex: faker.datatype.string(10),
      pagination: faker.datatype.boolean(),
      pageParam: faker.datatype.string(10),
      baseUrl: faker.internet.url(),
      startPathNamesJoin: faker.datatype.string(10),
    };

    const shippingPolicyInput: CreateSellerShippingPolicyInput = {
      minimumAmountForFree: faker.datatype.number({ min: 1, max: 5000 }),
      fee: faker.datatype.number({ min: 1, max: 5000 }),
    };

    const returnAddressInput: CreateSellerReturnAddressInput = {
      baseAddress: faker.address.city(),
      detailAddress: faker.address.secondaryAddress(),
      postalCode: faker.address.zipCode(),
    };

    const createSellerInput: CreateSellerInput = {
      businessName: faker.company.companyName(),
      businessCode: faker.finance.bic(),
      mailOrderBusinessCode: faker.finance.bic(),
      representativeName: faker.name.firstName(),
      email: faker.internet.email(),
      orderNotiPhoneNumber: '010' + faker.datatype.number({ precision: 8 }),
      csNotiPhoneNumber: '010' + faker.datatype.number({ precision: 8 }),
      phoneNumber: '010' + faker.datatype.number({ precision: 8 }),
      operationTimeMessage: faker.company.catchPhrase(),
      kakaoTalkCode: faker.datatype.string(10),
      saleStrategyInput,
      claimPolicyInput,
      crawlPolicyInput,
      crawlStrategyInput,
      shippingPolicyInput,
      returnAddressInput,
      courierId,
      brandId,
      userId,
    };

    return await this.sellersService.create(createSellerInput);
  }
}
