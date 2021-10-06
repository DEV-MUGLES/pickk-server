import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { BaseResolver } from '@common/base.resolver';

import { SellerRelationType, SELLER_RELATIONS } from '@item/sellers/constants';
import {
  UpdateSellerInput,
  UpdateSellerClaimPolicyInput,
  UpdateSellerCrawlPolicyInput,
  UpdateSellerReturnAddressInput,
  UpdateSellerSettlePolicyInput,
  UpdateSellerShippingPolicyInput,
} from '@item/sellers/dtos';
import {
  Seller,
  SellerCrawlPolicy,
  SellerClaimPolicy,
  SellerShippingPolicy,
  SellerReturnAddress,
  SellerSettlePolicy,
} from '@item/sellers/models';
import { SellersService } from '@item/sellers/sellers.service';

@Resolver()
export class SellerSellerResolver extends BaseResolver<SellerRelationType> {
  relations = SELLER_RELATIONS;

  constructor(private sellersService: SellersService) {
    super();
  }

  @Query(() => Seller)
  @UseGuards(JwtSellerVerifyGuard)
  async meSeller(
    @CurrentUser() { sellerId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Seller> {
    return await this.sellersService.get(
      sellerId,
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => Seller)
  @UseGuards(JwtSellerVerifyGuard)
  async updateMeSeller(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('updateSellerInput') updateSellerInput: UpdateSellerInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Seller> {
    return await this.sellersService.update(
      sellerId,
      {
        ...updateSellerInput,
      },
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => SellerClaimPolicy)
  @UseGuards(JwtSellerVerifyGuard)
  async updateMySellerClaimPolicy(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('updateSellerClaimPolicyInput')
    updateSellerClaimPolicyInput: UpdateSellerClaimPolicyInput
  ): Promise<SellerClaimPolicy> {
    return await this.sellersService.updateClaimPolicy(
      sellerId,
      updateSellerClaimPolicyInput
    );
  }

  @Mutation(() => SellerSettlePolicy, {
    description: '추가도 이거로 해주시면 됩니다!',
  })
  @UseGuards(JwtSellerVerifyGuard)
  async updateMySellerSettlePolicy(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('updateSellerSettlePolicyInput')
    input: UpdateSellerSettlePolicyInput
  ): Promise<SellerSettlePolicy> {
    return await this.sellersService.updateSettlePolicy(sellerId, input);
  }

  @Mutation(() => SellerCrawlPolicy)
  @UseGuards(JwtSellerVerifyGuard)
  async updateMySellerCrawlPolicy(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('updateSellerCrawlPolicyInput')
    updateSellerCrawlPolicyInput: UpdateSellerCrawlPolicyInput
  ): Promise<SellerCrawlPolicy> {
    return await this.sellersService.updateCrawlPolicy(
      sellerId,
      updateSellerCrawlPolicyInput
    );
  }

  @Mutation(() => SellerShippingPolicy)
  @UseGuards(JwtSellerVerifyGuard)
  async updateMySellerShippingPolicy(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('updateSellerShippingPolicyInput')
    updateSellerShippingPolicyInput: UpdateSellerShippingPolicyInput
  ): Promise<SellerShippingPolicy> {
    return await this.sellersService.updateShippingPolicy(
      sellerId,
      updateSellerShippingPolicyInput
    );
  }

  @Mutation(() => SellerReturnAddress)
  @UseGuards(JwtSellerVerifyGuard)
  async updateMySellerReturnAddress(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('updateSellerReturnAddressInput')
    updateSellerReturnAddressInput: UpdateSellerReturnAddressInput
  ): Promise<SellerReturnAddress> {
    return await this.sellersService.updateReturnAddress(
      sellerId,
      updateSellerReturnAddressInput
    );
  }
}
