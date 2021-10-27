import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser, Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

import {
  InquirySearchFilter,
  SearchInquiriesOutput,
} from '@mcommon/search/dtos';
import { InquirySearchService } from '@mcommon/search/inquiry.search.service';
import {
  InquiryAnswerFrom,
  InquiryRelationType,
  INQUIRY_RELATIONS,
} from '@item/inquiries/constants';
import { InquiriesCountOutput } from '@admin/seller/item/inquiry/dtos';
import {
  AnswerInquiryInput,
  InquiryFilter,
  UpdateInquiryAnswerInput,
} from '@item/inquiries/dtos';
import { Inquiry, InquiryAnswer } from '@item/inquiries/models';
import { InquiriesService } from '@item/inquiries/inquiries.service';
import { UserRole } from '@user/users/constants';
import { User } from '@user/users/models';

import { RootInquiryService } from './root-inquiry.service';

@Injectable()
export class RootInquiryResolver extends BaseResolver<InquiryRelationType> {
  relations = INQUIRY_RELATIONS;

  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly rootInquiryService: RootInquiryService,
    private readonly inquirySearchService: InquirySearchService,
    private cacheService: CacheService
  ) {
    super();
  }

  @Query(() => Inquiry)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async rootInquiry(
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry> {
    return await this.inquiriesService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Inquiry])
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async rootInquiries(
    @Args('filter', { nullable: true }) filter: InquiryFilter,
    @Args('pageInput', { nullable: true }) pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry[]> {
    return await this.inquiriesService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => InquiriesCountOutput, { description: '[ROOT ADMIN]' })
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async rootInquiriesCount(
    @Args('forceUpdate', { nullable: true }) forceUpdate?: boolean
  ): Promise<InquiriesCountOutput> {
    if (!forceUpdate) {
      const cached = await this.cacheService.get<InquiriesCountOutput>(
        InquiriesCountOutput.getCacheKey(0)
      );

      if (cached) {
        return new InquiriesCountOutput(cached);
      }
    }

    const count = await this.rootInquiryService.getCount();

    await this.cacheService.set<InquiriesCountOutput>(count.cacheKey, count, {
      ttl: 60 * 5,
    });

    return count;
  }

  @Mutation(() => Inquiry)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async answerRootInquiry(
    @CurrentUser() user: User,
    @IntArgs('id') id: number,
    @Args('answerInquiryInput') input: AnswerInquiryInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry> {
    await this.inquiriesService.answer(id, {
      ...input,
      userId: user.id,
      from: InquiryAnswerFrom.Root,
    });

    return await this.inquiriesService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => InquiryAnswer)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async updateRootInquiryAnswer(
    @IntArgs('id') id: number,
    @Args('updateInquiryAnswerInput') input: UpdateInquiryAnswerInput
  ): Promise<InquiryAnswer> {
    await this.inquiriesService.updateAnswer(id, input);

    return await this.inquiriesService.getAnswer(id);
  }

  @Query(() => SearchInquiriesOutput)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async searchRootInquiries(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: InquirySearchFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<SearchInquiriesOutput> {
    const { ids, total } = await this.inquirySearchService.search(
      query,
      pageInput,
      filter,
      [{ id: 'desc' }]
    );
    const inquiries = await this.inquiriesService.list({ idIn: ids }, null, [
      'answers',
      'item',
      'user',
      'orderItem',
      'orderItem.order',
      'orderItem.order.buyer',
    ]);

    return { total, result: inquiries };
  }

  @Query(() => Int)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.Admin)
  async searchRootInquiryCount(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: InquirySearchFilter
  ): Promise<number> {
    const { total } = await this.inquirySearchService.search(
      query,
      { offset: 0, limit: 0 } as PageInput,
      filter
    );

    return total;
  }
}
