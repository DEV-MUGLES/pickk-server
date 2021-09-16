import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractImageEntity } from '@common/entities';

import { ILook, ILookImage } from '../interfaces';

@ObjectType()
@Entity({ name: 'look_image' })
export class LookImageEntity extends AbstractImageEntity implements ILookImage {
  constructor(attributes?: Partial<LookImageEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }
    this.look = attributes.look;
    this.lookId = attributes.lookId;

    this.order = attributes.order;
  }

  @ManyToOne('LookEntity', 'images', { onDelete: 'CASCADE' })
  @JoinColumn()
  look: ILook;
  @Field(() => Int)
  @Column()
  lookId: number;

  @Field(() => Int)
  @Column({ type: 'tinyint', default: 0, unsigned: true })
  order: number;
}
