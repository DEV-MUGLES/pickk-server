import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { IsString } from 'class-validator';

import { BaseIdEntity } from '@common/entities';

import { ICourierIssue } from '../interfaces';

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
