import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
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
import {
  AnswerInquiryInput,
  InquiryFilter,
  UpdateInquiryAnswerInput,
} from '@item/inquiries/dtos';
import { Inquiry, InquiryAnswer } from '@item/inquiries/models';
import { InquiriesService } from '@item/inquiries/inquiries.service';

import { InquiriesCountOutput } from './dtos';
import { SellerInquiryProducer } from './producers';

import { SellerInquiryService } from './seller-inquiry.service';

@Injectable()
export class SellerInquiryResolver extends BaseResolver<InquiryRelationType> {
  relations = INQUIRY_RELATIONS;

  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly sellerInquiryService: SellerInquiryService,
    private cacheService: CacheService,
    private readonly sellerInquiryProducer: SellerInquiryProducer
  ) {
    super();
  }

  @Query(() => Inquiry)
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerInquiry(
    @CurrentUser() { sellerId }: JwtPayload,
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry> {
    await this.sellerInquiryService.checkBelongsTo(id, sellerId);

    return await this.inquiriesService.get(id, this.getRelationsFromInfo(info));
  }

  @Query(() => [Inquiry])
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerInquiries(
    @CurrentUser() { sellerId }: JwtPayload,
    @Args('filter', { nullable: true }) filter: InquiryFilter,
    @Args('pageInput', { nullable: true }) pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry[]> {
    return await this.inquiriesService.list(
      {
        sellerId,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => InquiriesCountOutput)
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerInquiriesCount(
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

    const count = await this.sellerInquiryService.getCount(sellerId);

    await this.cacheService.set<InquiriesCountOutput>(count.cacheKey, count, {
      ttl: 60 * 5,
    });

    return count;
  }

  @Mutation(() => Inquiry)
  @UseGuards(JwtSellerVerifyGuard)
  async answerMeSellerInquiry(
    @CurrentUser() { sellerId, sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('answerInquiryInput') input: AnswerInquiryInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry> {
    await this.sellerInquiryService.checkBelongsTo(id, sellerId);

    await this.inquiriesService.answer(id, {
      ...input,
      userId,
      from: InquiryAnswerFrom.Seller,
    });

    await this.sellerInquiryProducer.sendInquiryAnsweredAlimtalk(id);

    return await this.inquiriesService.get(id, this.getRelationsFromInfo(info));
  }

  @Mutation(() => InquiryAnswer)
  @UseGuards(JwtSellerVerifyGuard)
  async updateMeSellerInquiryAnswer(
    @CurrentUser() { sellerId }: JwtPayload,
    @IntArgs('id') id: number,
    @Args('updateInquiryAnswerInput') input: UpdateInquiryAnswerInput
  ): Promise<InquiryAnswer> {
    await this.sellerInquiryService.checkAnswerBelongsTo(id, sellerId);
    await this.inquiriesService.updateAnswer(id, input);

    return await this.inquiriesService.getAnswer(id);
  }
}
