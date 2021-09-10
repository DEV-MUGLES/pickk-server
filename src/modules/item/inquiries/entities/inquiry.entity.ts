import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { Item } from '@item/items/models';
import { OrderItem } from '@order/order-items/models';
import { User } from '@user/users/models';

import { InquiryType } from '../constants';
import { IInquiry, IInquiryAnswer } from '../interfaces';

import { InquiryAnswer } from '../models/inquiry-answer.model';
import { Seller } from '@item/sellers/models';

@ObjectType()
@Entity({ name: 'inquiry' })
@Index('idx_createdAt', ['createdAt'])
export class InquiryEntity extends BaseIdEntity implements IInquiry {
  constructor(attributes?: Partial<InquiryEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;
    this.item = attributes.item;
    this.itemId = attributes.itemId;
    this.seller = attributes.seller;
    this.sellerId = attributes.sellerId;
    this.orderItem = attributes.orderItem;
    this.orderItemMerchantUid = attributes.orderItemMerchantUid;

    this.answers = attributes.answers;

    this.type = attributes.type;
    this.title = attributes.title;
    this.content = attributes.content;
    this.contactPhoneNumber = attributes.contactPhoneNumber;
    this.isSecret = attributes.isSecret;

    this.isAnswered = attributes.isAnswered;
  }

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  userId: number;
  @Field(() => Item, { nullable: true })
  @ManyToOne('ItemEntity', { nullable: true })
  item: Item;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  itemId: number;
  @Field(() => Seller, { nullable: true })
  @ManyToOne('SellerEntity', { nullable: true })
  seller: Seller;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  sellerId: number;
  @Field(() => OrderItem, { nullable: true })
  @ManyToOne('OrderItemEntity', { nullable: true })
  orderItem: OrderItem;
  @Field({ nullable: true })
  @Column({ nullable: true })
  orderItemMerchantUid: string;

  @Field(() => [InquiryAnswer])
  @OneToMany('InquiryAnswerEntity', 'inquiry', {
    cascade: true,
    onDelete: 'CASCADE',
  })
  answers: IInquiryAnswer[];

  // 여기부터 정보 fields
  @Field(() => InquiryType)
  @Column({ type: 'enum', enum: InquiryType })
  type: InquiryType;
  @Field({ description: '최대 길이 100' })
  @Column({ length: 100 })
  title: string;
  @Field({ description: '최대 길이 255' })
  @Column()
  content: string;
  @Field({ description: '알림톡 받을 전화번호 (11글자)' })
  @Column({ type: 'char', length: 11 })
  @Length(11)
  contactPhoneNumber: string;
  @Field()
  @Column()
  isSecret: boolean;

  // 계산되는 필드들
  @Field()
  @Column({ default: false })
  isAnswered: boolean;
}
