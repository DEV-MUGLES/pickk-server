import { ObjectType } from '@nestjs/graphql';

import { BaseImageEntity } from '../entities';

@ObjectType()
export class BaseImage extends BaseImageEntity {
  constructor(attributes?: Partial<BaseImage>) {
    super();
    if (!attributes) {
      return;
    }
    this.createdAt = attributes.createdAt;

    this.key = attributes.key;
    this.angle = attributes.angle;
  }
}
