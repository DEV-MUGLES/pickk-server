import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SaleStrategyRepository } from '@common/repositories';
import { Seller } from '@item/sellers/models/seller.model';
import { SellersRepository } from '@item/sellers/sellers.repository';
import { SellersService } from '@item/sellers/sellers.service';
import { UserRole } from '@user/users/constants';
import { User } from '@user/users/models';

import { UpdateBrandInput } from './dtos';
import { Brand } from './models';
import { BrandsRepository } from './brands.repository';
import { BrandsResolver } from './brands.resolver';
import { BrandsService } from './brands.service';

describe('BrandsResolver', () => {
  let brandsResolver: BrandsResolver;
  let brandsService: BrandsService;
  let sellersService: SellersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsResolver,
        BrandsService,
        BrandsRepository,
        SellersService,
        SellersRepository,
        SaleStrategyRepository,
      ],
    }).compile();

    brandsResolver = module.get<BrandsResolver>(BrandsResolver);
    brandsService = module.get<BrandsService>(BrandsService);
    sellersService = module.get<SellersService>(SellersService);
  });

  it('should be defined', () => {
    expect(brandsResolver).toBeDefined();
  });

  describe('updateBrand', () => {
    const updateBrandInput: UpdateBrandInput = {
      nameKor: faker.lorem.text(),
    };

    it('Admin인 경우: 정상적으로 업데이트한다.', async () => {
      const user = new User({ role: UserRole.Admin });

      const brandId = faker.datatype.number();
      const brand = new Brand({ id: brandId });
      const updatedBrand = new Brand({ ...brand, ...updateBrandInput });

      const brandsServiceUpdateSpy = jest
        .spyOn(brandsService, 'update')
        .mockImplementationOnce(() => null);
      const brandsServiceGetSpy = jest
        .spyOn(brandsService, 'get')
        .mockResolvedValueOnce(updatedBrand);

      const result = await brandsResolver.updateBrand(
        user,
        brandId,
        updateBrandInput
      );
      expect(result).toEqual(updatedBrand);
      expect(brandsServiceUpdateSpy).toHaveBeenCalledWith(
        brandId,
        updateBrandInput
      );
      expect(brandsServiceGetSpy).toHaveBeenCalledWith(brandId, []);
    });

    it('Seller인 경우: 자신의 브랜드면 업데이트한다.', async () => {
      const userId = faker.datatype.number();
      const user = new User({ id: userId, role: UserRole.Seller });

      const brandId = faker.datatype.number();
      const brand = new Brand({ id: brandId });
      const updatedBrand = new Brand({ ...brand, ...updateBrandInput });

      const seller = new Seller({ userId, brandId });

      const sellersServiceSpy = jest
        .spyOn(sellersService, 'findOne')
        .mockResolvedValueOnce(seller);
      const brandsServiceUpdateSpy = jest
        .spyOn(brandsService, 'update')
        .mockImplementationOnce(() => null);
      const brandsServiceGetSpy = jest
        .spyOn(brandsService, 'get')
        .mockResolvedValueOnce(updatedBrand);

      const result = await brandsResolver.updateBrand(
        user,
        brandId,
        updateBrandInput
      );
      expect(result).toEqual(updatedBrand);
      expect(sellersServiceSpy).toHaveBeenCalledWith({ userId });
      expect(brandsServiceUpdateSpy).toHaveBeenCalledWith(
        brandId,
        updateBrandInput
      );
      expect(brandsServiceGetSpy).toHaveBeenCalledWith(brandId, []);
    });

    it('Seller인 경우: 자신의 브랜드가 아니면 Unauthorized exception', async () => {
      const userId = faker.datatype.number();
      const user = new User({ id: userId, role: UserRole.Seller });

      const brandId = faker.datatype.number();
      const seller = new Seller({ userId, brandId: faker.datatype.number() });

      const sellersServiceSpy = jest
        .spyOn(sellersService, 'findOne')
        .mockResolvedValueOnce(seller);

      await expect(
        brandsResolver.updateBrand(user, brandId, updateBrandInput)
      ).rejects.toThrow(UnauthorizedException);
      expect(sellersServiceSpy).toHaveBeenCalledWith({ userId });
    });
  });
});
