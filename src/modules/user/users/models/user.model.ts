import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

import { PasswordIncorrectException } from '@auth/exceptions';
import {
  CreateRefundAccountInput,
  UpdateRefundAccountInput,
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from '../dtos';

import { UserEntity } from '../entities/user.entity';
import {
  UserAvatarImageNotFoundException,
  UserPasswordDuplicatedException,
  UserPasswordNotFoundException,
} from '../exceptions/user.exception';
import { RefundAccount } from './refund-account.model';
import { ShippingAddress } from './shipping-address.model';
import { UserAvatarImage } from './user-avatar-image.model';
import { UserPassword } from './user-password.model';

@ObjectType()
export class User extends UserEntity {
  @Field(() => [ShippingAddress], { nullable: true })
  shippingAddresses: ShippingAddress[];

  constructor(attributes?: Partial<User>) {
    super();
    if (!attributes) {
      return;
    }
    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.email = attributes.email;
    this.code = attributes.code;
    this.nickname = attributes.nickname;

    this.name = attributes.name;
    this.weight = attributes.weight;
    this.height = attributes.height;
    this.password = attributes.password;
    this.shippingAddresses = attributes.shippingAddresses;
    this.avatarImage = attributes.avatarImage;

    this.role = attributes.role;
    this.oauthProvider = attributes.oauthProvider;
    this.oauthCode = attributes.oauthCode;
  }

  public setAvatarImage = (key: string): UserAvatarImage => {
    this.avatarImage = new UserAvatarImage({ key });
    return this.avatarImage;
  };

  public removeAvatarImage = (): UserAvatarImage => {
    const { avatarImage } = this;
    if (!avatarImage) {
      throw new UserAvatarImageNotFoundException();
    }
    this.avatarImage = null;
    return avatarImage;
  };

  public updatePassword = (password: string, input: string): User => {
    if (!this.comparePassword(password)) {
      throw new PasswordIncorrectException();
    }
    if (password === input) {
      throw new UserPasswordDuplicatedException();
    }

    this.updatedAt = new Date();
    this.password = UserPassword.of(input);
    return this;
  };

  public comparePassword = (password: string): boolean => {
    if (!this.password) {
      throw new UserPasswordNotFoundException();
    }
    return this.password.compare(password);
  };

  public getShippingAddresses = (): ShippingAddress[] | undefined => {
    return this.shippingAddresses === null ? [] : this.shippingAddresses;
  };

  private setPrimaryShippingAddress = (index: number): void => {
    this.shippingAddresses.forEach((shippingAddress, _index) => {
      shippingAddress.isPrimary = _index === index;
    });
  };

  public addShippingAddress = (
    createShippingAddressInput: CreateShippingAddressInput
  ): ShippingAddress => {
    const shippingAddress = new ShippingAddress(createShippingAddressInput);
    this.shippingAddresses = (this.shippingAddresses ?? []).concat(
      shippingAddress
    );
    if (
      createShippingAddressInput.isPrimary ||
      this.shippingAddresses.length === 1
    ) {
      this.setPrimaryShippingAddress(this.shippingAddresses.length - 1);
    }
    return shippingAddress;
  };

  public updateShippingAddress = (
    addressId: number,
    updateShippingAddressInput: UpdateShippingAddressInput
  ): ShippingAddress => {
    const index = this.shippingAddresses?.findIndex(
      (address) => address.id === addressId
    );
    if (index < 0) {
      throw new NotFoundException('수정할 배송정보가 존재하지 않습니다.');
    }

    this.shippingAddresses[index] = new ShippingAddress({
      ...this.shippingAddresses[index],
      ...updateShippingAddressInput,
    });
    if (updateShippingAddressInput.isPrimary) {
      this.setPrimaryShippingAddress(index);
    }

    return this.shippingAddresses[index];
  };

  public removeShippingAddress = (addressId: number): ShippingAddress => {
    const index = this.shippingAddresses?.findIndex(
      (address) => address.id === addressId
    );
    if (index < 0) {
      throw new NotFoundException('삭제할 배송정보가 존재하지 않습니다.');
    }

    const deletedShippingAddress = this.shippingAddresses[index];

    this.shippingAddresses = [
      ...this.shippingAddresses.slice(0, index),
      ...this.shippingAddresses.slice(index + 1),
    ];

    if (deletedShippingAddress.isPrimary && this.shippingAddresses.length > 0) {
      this.setPrimaryShippingAddress(0);
    }

    return deletedShippingAddress;
  };

  public addRefundAccount = (
    createRefundAccountInput: CreateRefundAccountInput
  ): RefundAccount => {
    if (this.refundAccount) {
      throw new ConflictException('이미 환불계좌가 존재합니다.');
    }

    this.refundAccount = new RefundAccount(createRefundAccountInput);
    return this.refundAccount;
  };

  public updateRefundAccount = (
    updateRefundAccountInput: UpdateRefundAccountInput
  ): RefundAccount => {
    if (!this.refundAccount) {
      throw new NotFoundException('변경할 환불계좌가 존재하지 않습니다.');
    }

    this.refundAccount = new RefundAccount({
      ...this.refundAccount,
      ...updateRefundAccountInput,
    });
    return this.refundAccount;
  };

  public removeRefundAccount = (): RefundAccount => {
    if (!this.refundAccount) {
      throw new NotFoundException('삭제할 환불계좌가 존재하지 않습니다.');
    }

    const deleted = this.refundAccount;
    this.refundAccount = null;
    return deleted;
  };
}
