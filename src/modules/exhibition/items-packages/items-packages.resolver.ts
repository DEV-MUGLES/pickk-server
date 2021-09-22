import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';

import { UserRole } from '@user/users/constants';

import { ItemsPackageRelationType, ITEMS_PACKAGE_RELATIONS } from './constants';
import { ItemsPackage } from './models';

import { ItemsPackagesService } from './items-packages.service';

@Injectable()
export class ItemsPackagesResolver extends BaseResolver<ItemsPackageRelationType> {
  relations = ITEMS_PACKAGE_RELATIONS;

  constructor(private readonly itemsPackagesService: ItemsPackagesService) {
    super();
  }

  @Query(() => ItemsPackage)
  async itemsPackage(@Args('code') code: string): Promise<ItemsPackage> {
    return await this.itemsPackagesService.findByCode(code, this.relations);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => ItemsPackage)
  async updateItemsPackageItems(
    @Args('code') code: string,
    @Args('itemIds', { type: () => [Int] }) itemIds: number[],
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemsPackage> {
    await this.itemsPackagesService.updateItems(code, itemIds);

    return await this.itemsPackagesService.findByCode(
      code,
      this.getRelationsFromInfo(info)
    );
  }
}
