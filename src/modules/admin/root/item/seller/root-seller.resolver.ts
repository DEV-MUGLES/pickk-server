import { BadRequestException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';

import { Seller } from '@item/sellers/models';
import { SellerProducer } from '@item/sellers/producers';
import { SellersService } from '@item/sellers/sellers.service';
import { UserRole } from '@user/users/constants';

@Resolver(() => Seller)
export class RootSellerResolver {
  constructor(
    private readonly sellersService: SellersService,
    private readonly sellerProducer: SellerProducer
  ) {}

  @Mutation(() => Boolean)
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async scrapRootSeller(@IntArgs('id') id: number): Promise<boolean> {
    const seller = await this.sellersService.get(id, [
      'brand',
      'crawlPolicy',
      'crawlStrategy',
      'saleStrategy',
    ]);
    if (!seller.crawlPolicy.isUpdatingItems) {
      throw new BadRequestException('아이템 크롤링이 비활성화된 입점사입니다.');
    }

    await this.sellerProducer.scrapSellerItems(seller);
    return true;
  }
}
