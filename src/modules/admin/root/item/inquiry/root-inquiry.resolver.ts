import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser, Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { IntArgs } from '@common/decorators';

import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';
import { CacheService } from '@providers/cache/redis';

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
}
