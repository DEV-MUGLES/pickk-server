import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SaleStrategyRepository } from '@src/common/repositories/sale-strategy.repository';

import { CreateSellerInput } from './dto/seller.input';
import { SellerEntity } from './entities/seller.entity';
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

  async create(createSellerInput: CreateSellerInput): Promise<Seller> {
    const { saleStrategyInput, ...sellerAttributes } = createSellerInput;

    const saleStrategy = await this.saleStrategyRepository.findOrCreate(
      saleStrategyInput
    );

    const seller = new Seller({
      ...sellerAttributes,
      saleStrategy,
    });
    return await this.sellersRepository.save(seller);
  }
}
