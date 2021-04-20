import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SaleStrategy } from '@src/common/models/sale-strategy.model';
import { SaleStrategyRepository } from '@src/common/repositories/sale-strategy.repository';

import { CreateSellerInput } from './dtos/seller.input';
import { SellersRepository } from './sellers.repository';
import { SellersService } from './sellers.service';
import { Seller } from './models/seller.model';
import { SellerClaimPolicy } from './models/policies/seller-claim-policy.model';
import { SellerCrawlPolicy } from './models/policies/seller-crawl-policy.model';
import { SellerShippingPolicy } from './models/policies/seller-shipping-policy.model';
import { SellerReturnAddress } from './models/seller-return-address.model';

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
      },
      crawlPolicyInput: {
        isInspectingNew: faker.datatype.boolean(),
        isUpdatingSaleItemInfo: faker.datatype.boolean(),
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
      expect(result.claimPolicy).toBeTruthy();
      expect(result.crawlPolicy).toBeTruthy();
      expect(result.shippingPolicy).toBeTruthy();
      expect(result.saleStrategy).toBeTruthy();
      expect(result.returnAddress).toBeTruthy();
      expect(salesStrategyResposytoryFindOrCreateSpy).toHaveBeenCalledWith(
        createSellerInput.saleStrategyInput
      );
      expect(sellersRepositorySaveSpy).toHaveBeenCalledTimes(1);
      expect(sellersServiceGetSpy).toHaveBeenCalledTimes(1);
    });
  });
});
