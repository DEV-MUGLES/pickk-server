import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Field, InputType, OmitType } from '@nestjs/graphql';

import { Coupon } from '@order/coupons/models/coupon.model';
import { PayMethod } from '@order/orders/constants/order.enum';
import { ShippingAddress } from '@user/users/models';

import { PointNotEnoughException } from '../exceptions';
import { BaseOrderSheet } from '../models';
import { OrderSheet, OrderSheetProductData } from '../models/order-sheet.model';

@InputType()
export class OrderSheetProductInput extends OmitType(
  OrderSheetProductData,
  [] as const,
  InputType
) {}

@InputType()
export class OrderSheetInput extends OmitType(
  OrderSheet,
  ['userId', 'productDatas'] as const,
  InputType
) {
  @Field(() => [OrderSheetProductInput])
  productInputs: OrderSheetProductInput[];

  public static validate(
    input: OrderSheetInput,
    baseSheet: BaseOrderSheet
  ): void {
    const { payMethod, productInputs, usedPointAmount, shippingAddressId } =
      input;
    const {
      availableCoupons,
      availablePointAmount,
      shippingAddresses,
      refundAccount,
    } = baseSheet;

    if (usedPointAmount > availablePointAmount) {
      throw new PointNotEnoughException(usedPointAmount, availablePointAmount);
    }
    if (payMethod === PayMethod.Vbank && refundAccount === null) {
      throw new BadRequestException('취소계좌를 입력해주세요.');
    }
    if (!this.isShippingAddressExist(shippingAddressId, shippingAddresses)) {
      throw new NotFoundException('배송지를 찾을 수 없습니다.');
    }

    this.validateProductInputs(productInputs, availableCoupons);
  }

  private static isShippingAddressExist(
    inputId: number,
    shippingAddresses: ShippingAddress[]
  ): boolean {
    return shippingAddresses.findIndex(({ id }) => id === inputId) !== -1;
  }

  private static validateProductInputs(
    productInputs: OrderSheetProductInput[],
    coupons: Coupon[]
  ): void {
    if (productInputs.length > 0) {
      productInputs.forEach(({ couponId }) => {
        if (!couponId) {
          return;
        }
        if (!this.isCouponExist(couponId, coupons)) {
          throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
        }
      });
    }
  }

  private static isCouponExist(inputId: number, coupons: Coupon[]): boolean {
    return coupons.findIndex(({ id }) => id === inputId) !== -1;
  }
}
