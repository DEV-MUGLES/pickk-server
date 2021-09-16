import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Length } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { IItem } from '@item/items/interfaces';
import { ISeller } from '@item/sellers/interfaces';
import { IOrderItem } from '@order/order-items/interfaces';
import { IUser } from '@user/users/interfaces';

import { InquiryType } from '../constants';
import { IInquiry, IInquiryAnswer } from '../interfaces';

@ObjectType()
@Entity({ name: 'inquiry' })
@Index('idx-createdAt', ['createdAt'])
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

  @ManyToOne('UserEntity', { onDelete: 'CASCADE' })
  user: IUser;
  @Field(() => Int)
  @Column()
  userId: number;
  @ManyToOne('ItemEntity', { onDelete: 'SET NULL', nullable: true })
  item: IItem;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  itemId: number;
  @ManyToOne('SellerEntity', { onDelete: 'SET NULL', nullable: true })
  seller: ISeller;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  sellerId: number;
  @ManyToOne('OrderItemEntity', { onDelete: 'SET NULL', nullable: true })
  orderItem: IOrderItem;
  @Field({ nullable: true })
  @Column({ nullable: true })
  orderItemMerchantUid: string;

  @OneToMany('InquiryAnswerEntity', 'inquiry', { cascade: true })
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
  @Column({ type: 'char', length: 12 })
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
