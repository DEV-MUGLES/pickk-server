import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { SaleStrategyRepository } from '@common/repositories';
import { UserRole } from '@user/users/constants/user.enum';
import { User } from '@user/users/models/user.model';

import { Seller } from '../sellers/models/seller.model';
import { SellersRepository } from '../sellers/sellers.repository';
import { SellersService } from '../sellers/sellers.service';
import { BrandsRepository } from './brands.repository';
import { BrandsResolver } from './brands.resolver';
import { BrandsService } from './brands.service';
import { UpdateBrandInput } from './dtos/brand.input';
import { Brand } from './models/brand.model';

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

      const brandsServiceSpy = jest
        .spyOn(brandsService, 'update')
        .mockResolvedValueOnce(updatedBrand);

      const result = await brandsResolver.updateBrand(
        user,
        brandId,
        updateBrandInput
      );
      expect(result).toEqual(updatedBrand);
      expect(brandsServiceSpy).toHaveBeenCalledWith(brandId, updateBrandInput);
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
      const brandsServiceSpy = jest
        .spyOn(brandsService, 'update')
        .mockResolvedValueOnce(updatedBrand);

      const result = await brandsResolver.updateBrand(
        user,
        brandId,
        updateBrandInput
      );
      expect(result).toEqual(updatedBrand);
      expect(sellersServiceSpy).toHaveBeenCalledWith({ userId });
      expect(brandsServiceSpy).toHaveBeenCalledWith(brandId, updateBrandInput);
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
