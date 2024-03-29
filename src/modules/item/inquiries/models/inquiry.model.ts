import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';

import { partialEncrypt } from '@common/helpers';

import { Item } from '@item/items/models';
import { Seller } from '@item/sellers/models';
import { OrderItem } from '@order/order-items/models';
import { User } from '@user/users/models';

import { AnswerInquiryInput } from '../dtos';
import { InquiryEntity } from '../entities';

import { InquiryAnswer } from './inquiry-answer.model';

const SECRET_TITLE = '비공개 문의입니다';

@ObjectType()
export class Inquiry extends InquiryEntity {
  @Field(() => User)
  @Type(() => User)
  user: User;
  @Field(() => Item, { nullable: true })
  @Type(() => Item)
  item: Item;
  @Field(() => Seller, { nullable: true })
  @Type(() => Seller)
  seller: Seller;
  @Field(() => OrderItem, { nullable: true })
  @Type(() => OrderItem)
  orderItem: OrderItem;

  @Field(() => [InquiryAnswer])
  answers: InquiryAnswer[];

  securitify(userId: number): Inquiry {
    if (!this.isSecret || userId === this.userId) {
      return this;
    }

    return new Inquiry({
      id: this.id,
      type: this.type,
      title: SECRET_TITLE,
      content: '',
      isSecret: this.isSecret,
      isAnswered: this.isAnswered,
      createdAt: this.createdAt,
      user: new User({
        id: 0,
        nickname: partialEncrypt(this.user.nickname),
      }),
      answers: [],
    });
  }

  answer(input: AnswerInquiryInput) {
    this.isAnswered = true;
    this.answers.push(new InquiryAnswer(input));
  }
}
