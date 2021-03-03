import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ModelEntity } from 'src/common/serializers/model.serializer';
import { IUser } from '../interfaces/user.interface';

@ObjectType()
@Entity({
  name: 'user',
})
export class User extends ModelEntity implements IUser {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({
    unique: true,
  })
  email: string;

  @Field()
  @Column({ nullable: true, default: null })
  name: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'smallint',
    nullable: true,
  })
  weight: number;

  @Field({ nullable: true })
  @Column({
    type: 'smallint',
    nullable: true,
  })
  height: number;
}
