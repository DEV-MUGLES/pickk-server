import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

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
    this.order = attributes.order;
    this.look = attributes.look;
  }

  @Field(() => Int)
  @Column({ type: 'tinyint', default: 0, unsigned: true })
  order: number;

  @ManyToOne('LookEntity', 'images', {
    onDelete: 'CASCADE',
  })
  look: LookEntity;
}
