import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SaleStrategyRepository } from '@src/common/repositories/sale-strategy.repository';

import { CreateSellerInput, UpdateSellerInput } from './dto/seller.input';
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
}
