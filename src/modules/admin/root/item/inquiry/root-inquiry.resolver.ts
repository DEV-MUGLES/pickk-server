import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser, Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
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

import { RootInquiryService } from './root-inquiry.service';

@Injectable()
export class RootInquiryResolver extends BaseResolver<InquiryRelationType> {
  relations = INQUIRY_RELATIONS;

  constructor(
    @Inject(InquiriesService)
    private readonly inquiriesService: InquiriesService,
    @Inject(RootInquiryService)
    private readonly rootInquiryService: RootInquiryService,
    @Inject(CacheService) private cacheService: CacheService
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
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('forceUpdate', { nullable: true }) forceUpdate?: boolean
  ): Promise<InquiriesCountOutput> {
    if (!forceUpdate) {
      const cached = await this.cacheService.get<InquiriesCountOutput>(
        InquiriesCountOutput.getCacheKey(sellerId)
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
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('answerInquiryInput') input: AnswerInquiryInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry> {
    await this.inquiriesService.answer(id, {
      ...input,
      userId,
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
