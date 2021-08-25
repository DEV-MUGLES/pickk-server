import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtOrNotGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import { InquiryRelationType, INQUIRY_RELATIONS } from './constants';
import { InquiryFilter } from './dtos';
import { Inquiry } from './models';

import { InquiriesService } from './inquiries.service';

@Injectable()
export class InquiriesResolver extends BaseResolver<InquiryRelationType> {
  relations = INQUIRY_RELATIONS;

  constructor(
    @Inject(InquiriesService)
    private readonly inquiriesService: InquiriesService
  ) {
    super();
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
      payload?.sub ? this.getRelationsFromInfo(info, ['user']) : ['user']
    );

    return inquiries.map((inquiry) => inquiry.securitify(payload?.sub));
  }
}
