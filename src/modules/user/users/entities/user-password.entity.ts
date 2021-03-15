import { Column } from 'typeorm';

import { IUserPassword } from '../interfaces/user-password.interface';

export class UserPasswordEntity implements IUserPassword {
  @Column('varchar', { nullable: true })
  encrypted: string;

  @Column('varchar', { nullable: true })
  salt: string;

  @Column('datetime', { nullable: true })
  createdAt!: Date;
}
