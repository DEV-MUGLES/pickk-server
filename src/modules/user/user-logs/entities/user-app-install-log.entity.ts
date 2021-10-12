import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { IUser } from '@user/users/interfaces';

import { IUserAppInstallLog } from '../interfaces';

@ObjectType()
@Entity({ name: 'user_app_install_log' })
export class UserAppInstallLogEntity implements IUserAppInstallLog {
  constructor(attributes?: Partial<UserAppInstallLogEntity>) {
    if (!attributes) {
      return;
    }

    this.user = attributes.user;
    this.userId = attributes.userId;

    this.createdAt = attributes.createdAt;
  }

  @OneToOne('UserEntity')
  @JoinColumn()
  user: IUser;
  @Field(() => Int)
  @PrimaryColumn()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
