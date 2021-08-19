import { ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';

import { AbstractImageEntity } from '@common/entities';

import { LookEntity } from './look.entity';

@ObjectType()
@Entity({ name: 'look_image' })
export class LookImageEntity extends AbstractImageEntity {
  constructor(attributes?: Partial<LookImageEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.look = attributes.look;
  }

  @ManyToOne('LookEntity', 'images', {
    onDelete: 'CASCADE',
  })
  look: LookEntity;
}
