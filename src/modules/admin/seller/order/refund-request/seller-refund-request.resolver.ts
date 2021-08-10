import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Query, Info, Args } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { CurrentUser } from '@auth/decorators';
import { JwtSellerVerifyGuard } from '@auth/guards';
import { JwtPayload } from '@auth/models';
import { PageInput } from '@common/dtos';
import { BaseResolver } from '@common/base.resolver';

import {
  RefundRequestRelationType,
  REFUND_REQUEST_RELATIONS,
} from '@order/refund-requests/constants';
import { RefundRequestFilter } from '@order/refund-requests/dtos';
import { RefundRequest } from '@order/refund-requests/models';
import { RefundRequestsService } from '@order/refund-requests/refund-requests.service';

@Injectable()
export class SellerRefundRequestResolver extends BaseResolver<RefundRequestRelationType> {
  relations = REFUND_REQUEST_RELATIONS;

  constructor(
    @Inject(RefundRequestsService)
    private readonly refundRequestsService: RefundRequestsService
  ) {
    super();
  }

  @Query(() => [RefundRequest])
  @UseGuards(JwtSellerVerifyGuard)
  async meSellerRefundRequests(
    @CurrentUser() { sellerId }: JwtPayload,
    @Info() info?: GraphQLResolveInfo,
    @Args('refundRequestFilter', { nullable: true })
    filter?: RefundRequestFilter,
    @Args('pageInput', { nullable: true }) pageInput?: PageInput
  ): Promise<RefundRequest[]> {
    return await this.refundRequestsService.list(
      {
        sellerId,
        ...filter,
      },
      pageInput,
      this.getRelationsFromInfo(info)
    );
  }
}
