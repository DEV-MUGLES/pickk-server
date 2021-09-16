import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IUser } from '@user/users/interfaces';

import { InquiryAnswerFrom } from '../constants';
import { IInquiry, IInquiryAnswer } from '../interfaces';

@ObjectType()
@Entity({ name: 'inquiry_answer' })
export class InquiryAnswerEntity
  extends BaseIdEntity
  implements IInquiryAnswer
{
  constructor(attributes?: Partial<InquiryAnswerEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.inquiry = attributes.inquiry;
    this.inquiryId = attributes.inquiryId;

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.from = attributes.from;
    this.displayAuthor = attributes.displayAuthor;
    this.content = attributes.content;
  }

  @ManyToOne('InquiryEntity', { onDelete: 'CASCADE' })
  @JoinColumn()
  inquiry: IInquiry;
  @Field(() => Int)
  @Column()
  inquiryId: number;

  @ManyToOne('UserEntity', { nullable: true })
  user: IUser;
  @Field(() => Int, { nullable: true })
  @Column()
  userId: number;

  // 여기부터 정보 fields
  @Field(() => InquiryAnswerFrom)
  @Column({ type: 'enum', enum: InquiryAnswerFrom })
  from: InquiryAnswerFrom;
  @Field({ description: '표시될 답변작성자 이름. 최대 길이 30' })
  @Column({ length: 30 })
  displayAuthor: string;
  @Field({ description: '최대 길이 255' })
  @Column()
  content: string;
}
