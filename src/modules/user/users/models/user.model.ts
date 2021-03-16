import { UnauthorizedException } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

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
    shippingAddress: ShippingAddress
  ): ShippingAddress => {
    this.shippingAddresses = (this.shippingAddresses ?? []).concat(
      shippingAddress
    );
    return shippingAddress;
  };
}
