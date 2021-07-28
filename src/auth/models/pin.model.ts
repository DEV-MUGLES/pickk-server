import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsNumberString } from 'class-validator';
import * as faker from 'faker';

@ObjectType()
export class Pin {
  constructor(attributes: Partial<Pin>) {
    Object.assign(this, attributes);
  }

  static getCacheKey(userId: number, phoneNumber: string): string {
    return `pin:${userId}:${phoneNumber}`;
  }

  static create(userId: number, phoneNumber: string): Pin {
    return new Pin({
      userId,
      phoneNumber,
      code: faker.phone.phoneNumber('######'),
    });
  }

  @Field(() => Int, { description: 'userId와 같은 값입니다.' })
  get id(): number {
    return this.userId;
  }

  @Field(() => Int)
  @IsNumber()
  userId: number;

  @Field()
  @IsNumberString()
  phoneNumber: string;

  /** 인증코드입니다. graphql에서 노출되지 않습니다. */
  code: string;
}
