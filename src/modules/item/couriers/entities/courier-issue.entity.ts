import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';
import { ICourierIssue } from '../interfaces/courier-issue.interface';

@ObjectType()
export class CourierIssueEntity implements ICourierIssue {
  @Field()
  @Column({ nullable: true, default: null })
  @IsString()
  message: string;

  @Field()
  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  endAt: Date;
}
