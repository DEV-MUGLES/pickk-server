import { ObjectType } from '@nestjs/graphql';

import { CourierIssueEntity } from '../entities/courier-issue.entity';

@ObjectType()
export class CourierIssue extends CourierIssueEntity {
  constructor(attributes?: Partial<CourierIssue>) {
    super();
    if (!attributes) {
      return;
    }

    this.message = attributes.message;
    this.endAt = attributes.endAt;
  }
}
