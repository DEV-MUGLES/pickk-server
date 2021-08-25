import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { User } from '@user/users/models';

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

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.from = attributes.from;
    this.displayAuthor = attributes.displayAuthor;
    this.content = attributes.content;
  }

  @ManyToOne('InquiryEntity')
  inquiry: IInquiry;

  @Field(() => User, { nullable: true })
  @ManyToOne('UserEntity', { nullable: true })
  user: User;
  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
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
