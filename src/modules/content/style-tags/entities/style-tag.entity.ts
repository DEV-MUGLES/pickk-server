import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IStyleTag } from '../interfaces';

@ObjectType()
@Entity({ name: 'style_tag' })
export class StyleTagEntity extends BaseIdEntity implements IStyleTag {
  constructor(attributes?: Partial<StyleTagEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.name = attributes.name;
    this.order = attributes.order;
  }

  @Field({ description: '최대 길이 30' })
  @Column({ length: 30 })
  name: string;
  @Field(() => Int, { defaultValue: 0 })
  @Column({ type: 'tinyint', default: 0, unsigned: true })
  order: number;
}
