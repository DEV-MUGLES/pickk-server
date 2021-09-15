import { BadRequestException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { OrderItem } from '@order/order-items/models';
import { ShipmentOwnerType } from '@order/shipments/constants';
import { ShipmentFactory } from '@order/shipments/factories';

import { ExchangeRequestStatus } from '../constants';
import { ReshipExchangeRequestInput } from '../dtos';
import { ExchangeRequestEntity } from '../entities';

@ObjectType()
export class ExchangeRequest extends ExchangeRequestEntity {
  @Field(() => OrderItem)
  orderItem: OrderItem;

  reship(reshipInput: ReshipExchangeRequestInput) {
    this.markReshipping();
    this.reShipment = ShipmentFactory.create({
      ownerType: ShipmentOwnerType.ExchangeRequestReShip,
      ownerPk: this.merchantUid.toString(),
      ...reshipInput,
    });
  }

  markPicked() {
    if (this.status !== ExchangeRequestStatus.Requested) {
      throw new BadRequestException(
        `교환요청${this.merchantUid}가 요청됨 상태가 아닙니다.`
      );
    }

    this.status = ExchangeRequestStatus.Picked;
    this.pickedAt = new Date();
  }

  private markReshipping() {
    if (this.status !== ExchangeRequestStatus.Picked) {
      throw new BadRequestException(
        '수거완료 상태인 교환요청만 재배송 처리할 수 있습니다.'
      );
    }

    this.status = ExchangeRequestStatus.Reshipping;
    this.reshippingAt = new Date();
  }
}
