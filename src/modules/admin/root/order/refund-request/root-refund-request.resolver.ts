import { Injectable, UseGuards } from '@nestjs/common';
import { Info, Args, Query, Int, Mutation } from '@nestjs/graphql';
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
export class RootRefundRequestResolver extends BaseResolver<RefundRequestRelationType> {
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
    @Args('pageInput', { nullable: true }) pageInput?: PageInput,
    @Info() info?: GraphQLResolveInfo
  ): Promise<SearchRefundRequestsOutput> {
    const { ids: merchantUidIn, total } =
      await this.refundRequestSearchService.search(query, pageInput, filter, [
        { merchantUid: 'desc' },
      ]);

    const refundRequests = await this.refundRequestsService.list(
      { merchantUidIn },
      null,
      this.getRelationsFromInfo(info, [], 'result.')
    );

    return { total, result: refundRequests };
  }

  @Query(() => Int)
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async searchRootRefundRequestsCount(
    @Args('query', { nullable: true }) query?: string,
    @Args('searchFilter', { nullable: true })
    filter?: RefundRequestSearchFilter
  ): Promise<number> {
    const { total } = await this.refundRequestSearchService.search(
      query,
      { offset: 0, limit: 0 } as PageInput,
      filter
    );

    return total;
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async cancelRootRefundRequest(
    @Args('merchantUid') merchantUid: string
  ): Promise<boolean> {
    await this.refundRequestsService.cancel(merchantUid);
    return true;
  }
}
