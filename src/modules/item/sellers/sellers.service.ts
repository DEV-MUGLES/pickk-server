import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@src/common/dtos/pagination.dto';
import { FindSaleStrategyInput } from '@src/common/dtos/sale-strategy.input';
import { parseFilter } from '@src/common/helpers/filter.helpers';
import { SaleStrategy } from '@src/common/models/sale-strategy.model';
import { SaleStrategyRepository } from '@src/common/repositories/sale-strategy.repository';

import {
  UpdateSellerClaimPolicyInput,
  UpdateSellerCrawlPolicyInput,
  UpdateSellerReturnAddressInput,
  UpdateSellerShippingPolicyInput,
} from './dtos/seller-policies.input';
import { SellerFilter } from './dtos/seller.filter';
import { CreateSellerInput, UpdateSellerInput } from './dtos/seller.input';
import { SellerEntity } from './entities/seller.entity';
import { SellerClaimPolicy } from './models/policies/seller-claim-policy.model';
import { SellerCrawlPolicy } from './models/policies/seller-crawl-policy.model';
import { SellerShippingPolicy } from './models/policies/seller-shipping-policy.model';
import { SellerReturnAddress } from './models/seller-return-address.model';
import { Seller } from './models/seller.model';
import { SellersRepository } from './sellers.repository';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(SellersRepository)
    private readonly sellersRepository: SellersRepository,
    @InjectRepository(SaleStrategyRepository)
    private readonly saleStrategyRepository: SaleStrategyRepository
  ) {}

  async list(
    sellerFilter?: SellerFilter,
    pageInput?: PageInput,
    relations: string[] = []
  ): Promise<Seller[]> {
    const _sellerFilter = plainToClass(SellerFilter, sellerFilter);
    const _pageInput = plainToClass(PageInput, pageInput);

    return await this.sellersRepository.find({
      relations,
      where: parseFilter(_sellerFilter, pageInput?.idFilter),
      ...(_pageInput?.pageFilter ?? {}),
    });
  }

  async get(id: number, relations: string[] = []): Promise<Seller> {
    return await this.sellersRepository.get(id, relations);
  }

  async findOne(
    param: Partial<SellerEntity>,
    relations: string[] = []
  ): Promise<Seller | null> {
    return await this.sellersRepository.findOneEntity(param, relations);
  }

  async update(id: number, input: UpdateSellerInput): Promise<Seller> {
    await this.sellersRepository.update(id, input);
    return await this.get(id);
  }

  async create(createSellerInput: CreateSellerInput): Promise<Seller> {
    const {
      saleStrategyInput,
      claimPolicyInput,
      crawlPolicyInput,
      shippingPolicyInput,
      returnAddressInput,
      ...sellerAttributes
    } = createSellerInput;

    const saleStrategy = await this.saleStrategyRepository.findOrCreate(
      saleStrategyInput
    );

    const seller = new Seller({
      ...sellerAttributes,
      claimPolicy: new SellerClaimPolicy(claimPolicyInput),
      crawlPolicy: new SellerCrawlPolicy(crawlPolicyInput),
      shippingPolicy: new SellerShippingPolicy(shippingPolicyInput),
      returnAddress: new SellerReturnAddress(returnAddressInput),
      saleStrategy,
    });
    return await this.sellersRepository.save(seller);
  }

  async updateClaimPolicy(
    seller: Seller,
    input: UpdateSellerClaimPolicyInput
  ): Promise<SellerClaimPolicy> {
    seller.claimPolicy = new SellerClaimPolicy({
      ...seller.claimPolicy,
      ...input,
    });
    return (await this.sellersRepository.save(seller)).claimPolicy;
  }

  async updateCrawlPolicy(
    seller: Seller,
    input: UpdateSellerCrawlPolicyInput
  ): Promise<SellerCrawlPolicy> {
    seller.crawlPolicy = new SellerCrawlPolicy({
      ...seller.crawlPolicy,
      ...input,
    });
    return (await this.sellersRepository.save(seller)).crawlPolicy;
  }

  async updateShippingPolicy(
    seller: Seller,
    input: UpdateSellerShippingPolicyInput
  ): Promise<SellerShippingPolicy> {
    seller.shippingPolicy = new SellerShippingPolicy({
      ...seller.shippingPolicy,
      ...input,
    });
    return (await this.sellersRepository.save(seller)).shippingPolicy;
  }

  async updateSaleStrategy(
    seller: Seller,
    input: FindSaleStrategyInput
  ): Promise<SaleStrategy> {
    const saleStrategy = await this.saleStrategyRepository.findOrCreate(input);
    seller.saleStrategy = saleStrategy;
    return (await this.sellersRepository.save(seller)).saleStrategy;
  }

  async updateReturnAddress(
    seller: Seller,
    input: UpdateSellerReturnAddressInput
  ): Promise<SellerReturnAddress> {
    seller.returnAddress = new SellerReturnAddress({
      ...seller.returnAddress,
      ...input,
    });
    return (await this.sellersRepository.save(seller)).returnAddress;
  }
}
