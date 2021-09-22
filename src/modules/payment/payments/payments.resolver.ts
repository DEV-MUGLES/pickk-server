import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { Query, Args, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';

import { Roles } from '@auth/decorators';
import { JwtAuthGuard } from '@auth/guards';
import { BaseResolver } from '@common/base.resolver';
import { UserRole } from '@user/users/constants';

import { PAYMENT_RELATIONS } from './constants';
import { PaymentListOutput, PaymentFilter } from './dtos';

import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentsResolver extends BaseResolver {
  relations = PAYMENT_RELATIONS;

  constructor(
    @Inject(PaymentsService)
    private readonly paymentsService: PaymentsService
  ) {
    super();
  }

  @Query(() => PaymentListOutput, {
    description: '[Admin] 결제 목록을 조회합니다.',
  })
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard)
  async payments(
    @Args('paymentFilter') paymentFilter: PaymentFilter,
    @Info() info?: GraphQLResolveInfo
  ): Promise<PaymentListOutput> {
    const payments = await this.paymentsService.list(
      paymentFilter,
      this.getRelationsFromInfo(info)
    );
    return PaymentListOutput.of(payments);
  }
}
