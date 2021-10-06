import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { CreateSellerInput } from './dtos';
import {
  Seller,
  SellerClaimPolicy,
  SellerCrawlPolicy,
  SellerShippingPolicy,
  SellerReturnAddress,
  SellerSaleStrategy,
} from './models';

import { SellersRepository } from './sellers.repository';
import { SellersService } from './sellers.service';

describe('SellersService', () => {
  let sellersService: SellersService;
  let sellersRepository: SellersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellersService, SellersRepository],
    }).compile();

    sellersService = module.get<SellersService>(SellersService);
    sellersRepository = module.get<SellersRepository>(SellersRepository);
  });

  describe('create', () => {
    const createSellerInput: CreateSellerInput = {
      businessCode: faker.lorem.text(),
      businessName: '111-22-33333',
      mailOrderBusinessCode: faker.lorem.text(),
      email: faker.internet.email(),
      kakaoTalkCode: faker.lorem.text(),
      phoneNumber: '01044131261',
      representativeName: faker.lorem.text(),
      operationTimeMessage: faker.lorem.text(),
      csNotiPhoneNumber: '111-22-33333',
      orderNotiPhoneNumber: '111-22-33333',
      userId: faker.datatype.number(),
      brandId: faker.datatype.number(),
      courierId: faker.datatype.number(),
      saleStrategyInput: {
        canUseCoupon: faker.datatype.boolean(),
        canUseMileage: faker.datatype.boolean(),
        pickkDiscountRate: 5,
      },
      claimPolicyInput: {
        fee: faker.datatype.number(),
        phoneNumber: '01044131261',
        picName: faker.lorem.text(),
        isExchangable: faker.datatype.boolean(),
        isRefundable: faker.datatype.boolean(),
        description: faker.lorem.text(),
      },
      crawlPolicyInput: {
        isInspectingNew: faker.datatype.boolean(),
        isUpdatingItems: faker.datatype.boolean(),
      },
      shippingPolicyInput: {
        description: faker.datatype.string(),
        minimumAmountForFree: faker.datatype.number(),
        fee: faker.datatype.number(),
      },
      returnAddressInput: {
        baseAddress: faker.lorem.text(),
        detailAddress: faker.lorem.text(),
        name: faker.lorem.text(),
        receiverName: faker.lorem.text(),
        phoneNumber: '01044131261',
        postalCode: '12321',
      },
      crawlStrategyInput: {
        itemsSelector: faker.lorem.text(),
        codeRegex: faker.lorem.text(),
        baseUrl: faker.internet.url(),
        pageParam: faker.lorem.text(),
        pagination: faker.datatype.boolean(),
        startPathNamesJoin: faker.lorem.text(),
      },
    };
    it('create success', async () => {
      const {
        saleStrategyInput,
        claimPolicyInput,
        crawlPolicyInput,
        shippingPolicyInput,
        returnAddressInput,
        ...sellerAttributes
      } = createSellerInput;
      const seller = new Seller({
        ...sellerAttributes,
        claimPolicy: new SellerClaimPolicy(claimPolicyInput),
        crawlPolicy: new SellerCrawlPolicy(crawlPolicyInput),
        shippingPolicy: new SellerShippingPolicy(shippingPolicyInput),
        returnAddress: new SellerReturnAddress(returnAddressInput),
        saleStrategy: new SellerSaleStrategy(saleStrategyInput),
      });

      const sellersRepositorySaveSpy = jest
        .spyOn(sellersRepository, 'save')
        .mockResolvedValueOnce(seller);
      const sellersServiceGetSpy = jest
        .spyOn(sellersService, 'get')
        .mockResolvedValueOnce(seller);

      const result = await sellersService.create(createSellerInput);
      expect(result.businessCode).toEqual(createSellerInput.businessCode);
      expect(result.claimPolicy).toMatchObject(
        createSellerInput.claimPolicyInput
      );
      expect(result.crawlPolicy).toMatchObject(
        createSellerInput.crawlPolicyInput
      );
      expect(result.shippingPolicy).toMatchObject(
        createSellerInput.shippingPolicyInput
      );
      expect(result.saleStrategy).toMatchObject(
        createSellerInput.saleStrategyInput
      );
      expect(result.returnAddress).toMatchObject(
        createSellerInput.returnAddressInput
      );
      expect(sellersRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(sellersServiceGetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
