import { Field, ObjectType } from '@nestjs/graphql';
import dayjs from 'dayjs';

import { UpdateCourierIssueInput } from '../dtos';
import { CourierEntity } from '../entities';
import { CourierIssueInvalidEndAtException } from '../exceptions';
import { CourierIssue } from './courier-issue.model';

@ObjectType()
export class Courier extends CourierEntity {
  @Field(() => CourierIssue, { nullable: true })
  issue?: CourierIssue;

  constructor(attributes?: Partial<Courier>) {
    super();
    if (!attributes) {
      return;
    }
    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;

    this.name = attributes.name;
    this.code = attributes.code;
    this.phoneNumber = attributes.phoneNumber;
    this.returnReserveUrl = attributes.returnReserveUrl;

    this.issue = attributes.issue;
  }

  updateIssue(updateCourierIssueInput: UpdateCourierIssueInput): CourierIssue {
    if (dayjs().isAfter(updateCourierIssueInput.endAt)) {
      throw new CourierIssueInvalidEndAtException();
    }
    this.issue = new CourierIssue(updateCourierIssueInput);
    return this.issue;
  }
}
