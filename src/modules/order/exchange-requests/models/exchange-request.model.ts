import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { OrderItem } from '@order/order-items/models';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { ShipmentFactory } from '@order/shipments/factories';

import { ExchangeRequestStatus } from '../constants';
import { ReshipExchangeRequestInput } from '../dtos';
import { ExchangeRequestEntity } from '../entities';
import { ExchangeRequestMarkStrategyFactory } from '../factories';

@ObjectType()
export class ExchangeRequest extends ExchangeRequestEntity {
  @Field({ description: '[MODEL ONLY]' })
  get id(): string {
    return this.merchantUid;
  }
  @Type(() => OrderItem)
  @Field(() => OrderItem)
  orderItem: OrderItem;

  /////////////////
  // 상태변경 함수들 //
  /////////////////

  private markAs(as: ExchangeRequestStatus) {
    ExchangeRequestMarkStrategyFactory.from(as, this).execute();
  }
  markRequested() {
    this.markAs(ExchangeRequestStatus.Requested);
  }
  markPicked() {
    this.markAs(ExchangeRequestStatus.Picked);
  }
  /** mark as: rejected */
  reject(reason: string) {
    this.markAs(ExchangeRequestStatus.Rejected);
    this.rejectReason = reason;
  }
  /** mark as: reshipping */
  reship(reshipInput: ReshipExchangeRequestInput) {
    this.markAs(ExchangeRequestStatus.Reshipping);
    this.reShipment = ShipmentFactory.create({
      ownerType: ShipmentOwnerType.ExchangeRequestReship,
      ownerPk: this.merchantUid,
      ...reshipInput,
    });
  }
  /** orderItem의 상태도 변경된다. (join 필요) */
  markReshipped() {
    this.markAs(ExchangeRequestStatus.Reshipped);
  }
  /** orderItem의 상태도 변경된다. (join 필요) */
  markConverted() {
    this.markAs(ExchangeRequestStatus.Converted);
  }
}
