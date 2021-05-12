import { Field, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '@src/common/entities/base.entity';
import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { ICourierIssue } from '../interfaces/courier-issue.interface';

@ObjectType()
@Entity({
  name: 'courier_issue',
})
export class CourierIssueEntity extends BaseIdEntity implements ICourierIssue {
  constructor(attributes?: Partial<CourierIssueEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.message = attributes.message;
    this.endAt = attributes.endAt;
  }

  @Field()
  @Column()
  @IsString()
  message: string;

  @Field()
  @Column()
  endAt: Date;
}
