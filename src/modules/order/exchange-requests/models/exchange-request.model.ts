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
  @Type(() => OrderItem)
  @Field(() => OrderItem)
  orderItem: OrderItem;

  /////////////////
  // 상태변경 함수들 //
  /////////////////

  private markAs(as: ExchangeRequestStatus) {
    ExchangeRequestMarkStrategyFactory.from(as, this).execute();
  }
  markPicked() {
    this.markAs(ExchangeRequestStatus.Picked);
  }
  /** mark as: reshipping */
  reship(reshipInput: ReshipExchangeRequestInput) {
    this.markAs(ExchangeRequestStatus.Reshipping);
    this.reShipment = ShipmentFactory.create({
      ownerType: ShipmentOwnerType.ExchangeRequestReShip,
      ownerPk: this.merchantUid.toString(),
      ...reshipInput,
    });
  }
  /** orderItem의 상태도 변경된다. (join 필요) */
  markReshipped() {
    this.markAs(ExchangeRequestStatus.Reshipped);
  }
}
