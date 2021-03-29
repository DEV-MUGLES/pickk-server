import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SaleStrategyRepository } from '@src/common/repositories/sale-strategy.repository';

import { CreateSellerInput } from './dto/seller.input';
import { SellersRepository } from './sellers.repository';
import { SellersService } from './sellers.service';
import { SaleStrategy } from '@src/common/models/sale-strategy.model';
import { Seller } from './models/seller.model';

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
      userId: faker.random.number(),
      brandId: faker.random.number(),
      saleStrategyInput: {
        canUseCoupon: faker.random.boolean(),
        canUseMileage: faker.random.boolean(),
      },
      claimPolicyInput: {
        fee: faker.random.number(),
        phoneNumber: '01044131261',
        picName: faker.lorem.text(),
      },
      crawlPolicyInput: {
        isInspectingNew: faker.random.boolean(),
        isUpdatingSaleItemInfo: faker.random.boolean(),
      },
      shippingPolicyInput: {
        minimumAmountForFree: faker.random.number(),
        fee: faker.random.number(),
      },
      returnAddressInput: {
        baseAddress: faker.lorem.text(),
        detailAddress: faker.lorem.text(),
        postalCode: '12321',
      },
    };
    it('create success', async () => {
      const salesStrategyResposytoryFindOrCreateSpy = jest
        .spyOn(saleStrategyRepository, 'findOrCreate')
        .mockResolvedValueOnce(
          new SaleStrategy(createSellerInput.saleStrategyInput)
        );
      const sellersRepositorySaveSpy = jest
        .spyOn(sellersRepository, 'save')
        .mockImplementationOnce(async (v) => v as Seller);

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
    });
  });
});
