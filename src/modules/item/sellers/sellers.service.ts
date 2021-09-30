import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput, FindSaleStrategyInput } from '@common/dtos';
import { parseFilter } from '@common/helpers';
import { SaleStrategy } from '@common/models';
import { SaleStrategyRepository } from '@common/repositories';

import { SellerRelationType } from './constants';
import {
  UpdateSellerClaimPolicyInput,
  UpdateSellerCrawlPolicyInput,
  UpdateSellerReturnAddressInput,
  UpdateSellerSettlePolicyInput,
  UpdateSellerShippingPolicyInput,
  SellerFilter,
  CreateSellerInput,
  UpdateSellerInput,
} from './dtos';
import {
  SellerClaimPolicy,
  SellerCrawlPolicy,
  SellerShippingPolicy,
  SellerReturnAddress,
  Seller,
  SellerSettlePolicy,
  SellerSettleAccount,
} from './models';

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

    return this.sellersRepository.entityToModelMany(
      await this.sellersRepository.find({
        relations,
        where: parseFilter(_sellerFilter, _pageInput?.idFilter),
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async get(id: number, relations: SellerRelationType[] = []): Promise<Seller> {
    return await this.sellersRepository.get(id, relations);
  }

  async findOne(
    param: Partial<Seller>,
    relations: string[] = []
  ): Promise<Seller | null> {
    return await this.sellersRepository.findOneEntity(param, relations);
  }

  async update(
    id: number,
    input: UpdateSellerInput,
    relations: SellerRelationType[] = []
  ): Promise<Seller> {
    await this.sellersRepository.update(id, input);
    return await this.get(id, relations);
  }

  async create(
    createSellerInput: CreateSellerInput,
    relations: SellerRelationType[] = []
  ): Promise<Seller> {
    const {
      saleStrategyInput,
      claimPolicyInput,
      settlePolicyInput,
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
      claimPolicy: new SellerClaimPolicy({
        ...claimPolicyInput,
      }),
      crawlPolicy: new SellerCrawlPolicy(crawlPolicyInput),
      shippingPolicy: new SellerShippingPolicy(shippingPolicyInput),
      returnAddress: new SellerReturnAddress(returnAddressInput),
      saleStrategy,
      settlePolicy: settlePolicyInput
        ? new SellerSettlePolicy({
            ...settlePolicyInput,
            account: new SellerSettleAccount(settlePolicyInput.accountInput),
          })
        : null,
    });
    const newEntity = await this.sellersRepository.save(seller);
    return await this.get(newEntity.id, relations);
  }

  async updateClaimPolicy(
    id: number,
    input: UpdateSellerClaimPolicyInput
  ): Promise<SellerClaimPolicy> {
    const seller = await this.get(id, ['claimPolicy']);
    seller.updateClaimPolicy(input);
    return (await this.sellersRepository.save(seller)).claimPolicy;
  }

  async updateSettlePolicy(
    id: number,
    input: UpdateSellerSettlePolicyInput
  ): Promise<SellerSettlePolicy> {
    const seller = await this.get(id, ['settlePolicy', 'settlePolicy.account']);
    seller.updateSettlePolicy(input);
    return (await this.sellersRepository.save(seller)).settlePolicy;
  }

  async updateCrawlPolicy(
    id: number,
    input: UpdateSellerCrawlPolicyInput
  ): Promise<SellerCrawlPolicy> {
    const seller = await this.get(id, ['crawlPolicy']);
    seller.crawlPolicy = new SellerCrawlPolicy({
      ...seller.crawlPolicy,
      ...input,
    });
    return (await this.sellersRepository.save(seller)).crawlPolicy;
  }

  async updateShippingPolicy(
    id: number,
    input: UpdateSellerShippingPolicyInput
  ): Promise<SellerShippingPolicy> {
    const seller = await this.get(id, ['shippingPolicy']);
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
    id: number,
    input: UpdateSellerReturnAddressInput
  ): Promise<SellerReturnAddress> {
    const seller = await this.get(id, ['returnAddress']);
    seller.returnAddress = new SellerReturnAddress({
      ...seller.returnAddress,
      ...input,
    });
    return (await this.sellersRepository.save(seller)).returnAddress;
  }
}
