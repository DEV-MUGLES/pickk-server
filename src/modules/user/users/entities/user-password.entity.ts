import { Column } from 'typeorm';

import { IUserPassword } from '../interfaces';

export class UserPasswordEntity implements IUserPassword {
  @Column({ nullable: true })
  encrypted: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ type: 'datetime', nullable: true })
  createdAt!: Date;
}
