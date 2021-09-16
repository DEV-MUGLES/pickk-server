import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity as _TypeORMBaseEntity,
} from 'typeorm';

import { IBaseId } from '../interfaces';

@ObjectType()
export class BaseIdEntity extends _TypeORMBaseEntity implements IBaseId {
  constructor(attributes?: Partial<BaseIdEntity>) {
    super();
    if (!attributes) {
      return;
    }

    this.id = attributes.id;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;
  }

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
