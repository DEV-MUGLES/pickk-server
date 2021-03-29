import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtSellerGuard } from '@src/authentication/guards/jwt-seller.guard';
import { BaseResolver } from '@src/common/base.resolver';
import { SELLER_RELATIONS } from '@item/sellers/constants/seller.relation';
import { CurrentSeller } from '@item/sellers/decorators/current-seller.decorator';
import { UpdateSellerInput } from '@item/sellers/dto/seller.input';
import { Seller } from '@item/sellers/models/seller.model';
import { SellersService } from '@item/sellers/sellers.service';

@Resolver()
export class MySellerResolver extends BaseResolver {
  relations = SELLER_RELATIONS;

  constructor(@Inject(SellersService) private sellersService: SellersService) {
    super();
  }

  @Query(() => Seller)
  @UseGuards(JwtSellerGuard)
  meSeller(@CurrentSeller() seller: Seller) {
    return seller;
  }

  @Mutation(() => Seller)
  @UseGuards(JwtSellerGuard)
  async updateMeSeller(
    @CurrentSeller() seller: Seller,
    @Args('updateSellerInput') updateSellerInput: UpdateSellerInput
  ): Promise<Seller> {
    return await this.sellersService.update(seller.id, {
      ...updateSellerInput,
    });
  }
}
