import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateShippingAddressInput,
  UpdateShippingAddressInput,
} from '../dto/shipping-address.input';

import { UserEntity } from '../entities/user.entity';
import { ShippingAddress } from './shipping-address.model';
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
    this.email = attributes.email;
    this.name = attributes.name;
    this.code = attributes.code;
    this.weight = attributes.weight;
    this.height = attributes.height;
    this.password = attributes.password;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;
    this.shippingAddresses = attributes.shippingAddresses;
  }

  public updatePassword = (password: string, input: string): void => {
    if (!this.comparePassword(password)) {
      throw new UnauthorizedException();
    }

    this.updatedAt = new Date();
    this.password = UserPassword.create(input);
  };

  public comparePassword = (password: string): boolean => {
    return this.password.compare(password);
  };

  public getShippingAddresses = (): ShippingAddress[] | undefined => {
    return this.shippingAddresses === null ? [] : this.shippingAddresses;
  };

  public addShippingAddress = (
    createShippingAddressInput: CreateShippingAddressInput
  ): ShippingAddress => {
    const shippingAddress = new ShippingAddress(createShippingAddressInput);
    this.shippingAddresses = (this.shippingAddresses ?? []).concat(
      shippingAddress
    );
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

    const updatedShippingAddress = {
      ...this.shippingAddresses[index],
      ...updateShippingAddressInput,
    };

    this.shippingAddresses = [
      ...this.shippingAddresses.slice(0, index),
      updatedShippingAddress,
      ...this.shippingAddresses.slice(index + 1),
    ];

    return updatedShippingAddress;
  };
}
