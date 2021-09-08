import {
  ForbiddenException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard, JwtVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { IntArgs } from '@common/decorators';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { ItemsService } from '@item/items/items.service';

import { InquiryRelationType, INQUIRY_RELATIONS } from './constants';
import { CreateInquiryInput, InquiryFilter } from './dtos';
import { Inquiry } from './models';

import { InquiriesService } from './inquiries.service';

@Injectable()
export class InquiriesResolver extends BaseResolver<InquiryRelationType> {
  relations = INQUIRY_RELATIONS;

  constructor(
    @Inject(InquiriesService)
    private readonly inquiriesService: InquiriesService,
    @Inject(ItemsService)
    private readonly itemsService: ItemsService
  ) {
    super();
  }

  @Query(() => Int)
  async inquiriesCount(@IntArgs('itemId') itemId: number): Promise<number> {
    return await this.inquiriesService.count(itemId);
  }

  @Query(() => [Inquiry])
  @UseGuards(JwtOrNotGuard)
  async inquiries(
    @CurrentUser() payload: JwtPayload,
    @Args('filter', { nullable: true }) filter: InquiryFilter,
    @Args('pageInput', { nullable: true }) pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry[]> {
    const inquiries = await this.inquiriesService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info, ['user'])
    );

    return inquiries.map((inquiry) => inquiry.securitify(payload?.sub));
  }

  @Query(() => Inquiry)
  @UseGuards(JwtVerifyGuard)
  async meInquiry(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry> {
    const inquiry = await this.inquiriesService.get(
      id,
      this.getRelationsFromInfo(info)
    );

    if (inquiry.userId !== userId) {
      throw new ForbiddenException('자신의 문의가 아닙니다.');
    }

    return inquiry;
  }

  @Query(() => [Inquiry])
  @UseGuards(JwtVerifyGuard)
  async meInquiries(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('pageInput', { nullable: true }) pageInput: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<Inquiry[]> {
    return await this.inquiriesService.list(
      { userId },
      pageInput,
      this.getRelationsFromInfo(info, ['user'])
    );
  }

  @Mutation(() => Inquiry)
  @UseGuards(JwtVerifyGuard)
  async createInquiry(
    @CurrentUser() { sub: userId }: JwtPayload,
    @Args('createInquiryInput') input: CreateInquiryInput
  ): Promise<Inquiry> {
    const item = await this.itemsService.get(input.itemId, [
      'brand',
      'brand.seller',
    ]);

    return await this.inquiriesService.create({
      ...input,
      sellerId: item.brand.seller.id,
      userId,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtVerifyGuard)
  async removeInquiry(
    @CurrentUser() { sub: userId }: JwtPayload,
    @IntArgs('id') id: number
  ): Promise<boolean> {
    const inquiry = await this.inquiriesService.get(id);
    if (inquiry.userId !== userId) {
      throw new ForbiddenException('자신의 문의가 아닙니다.');
    }

    await this.inquiriesService.remove(inquiry);
    return true;
  }
}
