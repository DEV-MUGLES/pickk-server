import { ObjectType } from '@nestjs/graphql';

import { AbstractImageEntity } from '@src/common/entities/image.entity';

@ObjectType()
export class UserAvatarImage extends AbstractImageEntity {
  constructor(attributes?: Partial<AbstractImageEntity>) {
    super();
    if (!attributes) {
      return;
    }
    this.createdAt = attributes.createdAt;

    this.key = attributes.key;
    this.angle = attributes.angle;
  }
}
