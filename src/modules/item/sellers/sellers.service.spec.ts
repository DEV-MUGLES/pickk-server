import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SaleStrategy } from '@src/common/models/sale-strategy.model';
import { SaleStrategyRepository } from '@src/common/repositories/sale-strategy.repository';

import { ClaimFeePayMethod } from './constants/seller-claim-policy.enum';
import { CreateSellerInput } from './dtos/seller.input';
import {
  Seller,
  SellerClaimPolicy,
  SellerCrawlPolicy,
  SellerShippingPolicy,
  SellerReturnAddress,
} from './models';

import { SellersRepository } from './sellers.repository';
import { SellersService } from './sellers.service';

describe('SellersService', () => {
  let sellersService: SellersService;
  let sellersRepository: SellersRepository;
  let saleStrategyRepository: SaleStrategyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellersService, SellersRepository, SaleStrategyRepository],
    }).compile();

    sellersService = module.get<SellersService>(SellersService);
    sellersRepository = module.get<SellersRepository>(SellersRepository);
    saleStrategyRepository = module.get<SaleStrategyRepository>(
      SaleStrategyRepository
    );
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
      userId: faker.datatype.number(),
      brandId: faker.datatype.number(),
      courierId: faker.datatype.number(),
      saleStrategyInput: {
        canUseCoupon: faker.datatype.boolean(),
        canUseMileage: faker.datatype.boolean(),
      },
      claimPolicyInput: {
        fee: faker.datatype.number(),
        phoneNumber: '01044131261',
        picName: faker.lorem.text(),
        feePayMethod: ClaimFeePayMethod.Enclose,
      },
      crawlPolicyInput: {
        isInspectingNew: faker.datatype.boolean(),
        isUpdatingItems: faker.datatype.boolean(),
      },
      shippingPolicyInput: {
        minimumAmountForFree: faker.datatype.number(),
        fee: faker.datatype.number(),
      },
      returnAddressInput: {
        baseAddress: faker.lorem.text(),
        detailAddress: faker.lorem.text(),
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
      const saleStrategy = new SaleStrategy(saleStrategyInput);
      const seller = new Seller({
        ...sellerAttributes,
        claimPolicy: new SellerClaimPolicy(claimPolicyInput),
        crawlPolicy: new SellerCrawlPolicy(crawlPolicyInput),
        shippingPolicy: new SellerShippingPolicy(shippingPolicyInput),
        returnAddress: new SellerReturnAddress(returnAddressInput),
        saleStrategy,
      });

      const salesStrategyResposytoryFindOrCreateSpy = jest
        .spyOn(saleStrategyRepository, 'findOrCreate')
        .mockResolvedValueOnce(saleStrategy);
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
      expect(salesStrategyResposytoryFindOrCreateSpy).toHaveBeenCalledWith(
        createSellerInput.saleStrategyInput
      );
      expect(sellersRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(sellersServiceGetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
