import { Injectable, UseGuards } from '@nestjs/common';
import { Info, Args, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { PageInput } from '@common/dtos';

import { SearchRefundRequestsOutput } from '@admin/seller/order/refund-request/dtos';
import { UserRole } from '@user/users/constants';
import { RefundRequestSearchFilter } from '@mcommon/search/dtos';
import { RefundRequestSearchService } from '@mcommon/search/refund-request.search.service';
import {
  RefundRequestRelationType,
  REFUND_REQUEST_RELATIONS,
} from '@order/refund-requests/constants';
import { RefundRequestFilter } from '@order/refund-requests/dtos';
import { RefundRequest } from '@order/refund-requests/models';
import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';

@Injectable()
export class RootRefundRequestResolver extends BaseResolver<
  RefundRequestRelationType
> {
  relations = REFUND_REQUEST_RELATIONS;

  constructor(
    private readonly refundRequestsService: RefundRequestsService,
    private readonly refundRequestSearchService: RefundRequestSearchService
  ) {
    super();
  }

  @Query(() => [RefundRequest])
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async rootRefundRequests(
    @Info() info?: GraphQLResolveInfo,
    @Args('refundRequestFilter', { nullable: true })
    filter?: RefundRequestFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<RefundRequest[]> {
    return await this.refundRequestsService.list(
      filter,
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }

  @Query(() => SearchRefundRequestsOutput)
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async searchRootRefundRequests(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: RefundRequestSearchFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<SearchRefundRequestsOutput> {
    const {
      ids: merchantUidIn,
      total,
    } = await this.refundRequestSearchService.search(query, pageInput, filter, [
      { merchantUid: 'desc' },
    ]);

    const refundRequests = await this.refundRequestsService.list(
      { merchantUidIn },
      null,
      ['order', 'order.buyer', 'shipment']
    );

    return { total, result: refundRequests };
  }
}
