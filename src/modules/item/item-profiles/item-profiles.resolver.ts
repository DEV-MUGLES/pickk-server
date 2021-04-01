import { Inject } from '@nestjs/common';
import { Resolver, Query, Info } from '@nestjs/graphql';

import { BaseResolver } from '@src/common/base.resolver';
import { IntArgs } from '@src/common/decorators/args.decorator';
import { GraphQLResolveInfo } from 'graphql';

import { ITEM_PROFILE_RELATIONS } from './constants/item-profile.relation';
import { ItemProfilesService } from './item-profiles.service';
import { ItemProfile } from './models/item-profile.model';

@Resolver(() => ItemProfile)
export class ItemProfilesResolver extends BaseResolver {
  relations = ITEM_PROFILE_RELATIONS;

  constructor(
    @Inject(ItemProfilesService)
    private itemProfilesService: ItemProfilesService
  ) {
    super();
  }

  @Query(() => ItemProfile)
  async itemProfile(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemProfile> {
    return this.itemProfilesService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [ItemProfile])
  async itemProfiles(
    @Info() info?: GraphQLResolveInfo
  ): Promise<ItemProfile[]> {
    return this.itemProfilesService.list(this.getRelationsFromInfo(info));
  }
}
