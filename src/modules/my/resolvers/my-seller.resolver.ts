import { Inject, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { JwtSellerGuard } from '@src/authentication/guards/jwt-seller.guard';
import { BaseResolver } from '@src/common/base.resolver';
import { SELLER_RELATIONS } from '@item/sellers/constants/seller.relation';
import { CurrentSeller } from '@item/sellers/decorators/current-seller.decorator';
import { UpdateSellerInput } from '@src/modules/item/sellers/dtos/seller.input';
import { Seller } from '@item/sellers/models/seller.model';
import { SellersService } from '@item/sellers/sellers.service';
import { SellerCrawlPolicy } from '@item/sellers/models/policies/seller-crawl-policy.model';
import {
  UpdateSellerClaimPolicyInput,
  UpdateSellerCrawlPolicyInput,
  UpdateSellerReturnAddressInput,
  UpdateSellerSettlePolicyInput,
  UpdateSellerShippingPolicyInput,
} from '@src/modules/item/sellers/dtos/seller-policies.input';
import { SellerClaimPolicy } from '@src/modules/item/sellers/models/policies/seller-claim-policy.model';
import { SellerShippingPolicy } from '@src/modules/item/sellers/models/policies/seller-shipping-policy.model';
import { SellerReturnAddress } from '@src/modules/item/sellers/models/seller-return-address.model';
import { SellerSettlePolicy } from '@src/modules/item/sellers/models/policies/seller-settle-policy.model';

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
    @Args('updateSellerInput') updateSellerInput: UpdateSellerInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Seller> {
    return await this.sellersService.update(
      seller.id,
      {
        ...updateSellerInput,
      },
      this.getRelationsFromInfo(info)
    );
  }

  @Mutation(() => SellerClaimPolicy)
  @UseGuards(JwtSellerGuard)
  async updateMySellerClaimPolicy(
    @CurrentSeller() seller: Seller,
    @Args('updateSellerClaimPolicyInput')
    updateSellerClaimPolicyInput: UpdateSellerClaimPolicyInput
  ): Promise<SellerClaimPolicy> {
    return await this.sellersService.updateClaimPolicy(
      seller,
      updateSellerClaimPolicyInput
    );
  }

  @Mutation(() => SellerSettlePolicy, {
    description: '추가도 이거로 해주시면 됩니다!',
  })
  @UseGuards(JwtSellerGuard)
  async updateMySellerSettlePolicy(
    @CurrentSeller() seller: Seller,
    @Args('updateSellerSettlePolicyInput')
    updateSellerSettlePolicyInput: UpdateSellerSettlePolicyInput
  ): Promise<SellerSettlePolicy> {
    return await this.sellersService.updateSettlePolicy(
      seller,
      updateSellerSettlePolicyInput
    );
  }

  @Mutation(() => SellerCrawlPolicy)
  @UseGuards(JwtSellerGuard)
  async updateMySellerCrawlPolicy(
    @CurrentSeller() seller: Seller,
    @Args('updateSellerCrawlPolicyInput')
    updateSellerCrawlPolicyInput: UpdateSellerCrawlPolicyInput
  ): Promise<SellerCrawlPolicy> {
    return await this.sellersService.updateCrawlPolicy(
      seller,
      updateSellerCrawlPolicyInput
    );
  }

  @Mutation(() => SellerShippingPolicy)
  @UseGuards(JwtSellerGuard)
  async updateMySellerShippingPolicy(
    @CurrentSeller() seller: Seller,
    @Args('updateSellerShippingPolicyInput')
    updateSellerShippingPolicyInput: UpdateSellerShippingPolicyInput
  ): Promise<SellerShippingPolicy> {
    return await this.sellersService.updateShippingPolicy(
      seller,
      updateSellerShippingPolicyInput
    );
  }

  @Mutation(() => SellerReturnAddress)
  @UseGuards(JwtSellerGuard)
  async updateMySellerReturnAddress(
    @CurrentSeller() seller: Seller,
    @Args('updateSellerReturnAddressInput')
    updateSellerReturnAddressInput: UpdateSellerReturnAddressInput
  ): Promise<SellerReturnAddress> {
    return await this.sellersService.updateReturnAddress(
      seller,
      updateSellerReturnAddressInput
    );
  }
}
