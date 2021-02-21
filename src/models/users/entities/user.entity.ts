import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interfaces/user.interface';

/**
 * Entity Schema for user.
 *
 * @class
 */
@Entity({
  name: 'user',
})
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;

  @Column({
    type: 'smallint',
  })
  weight: number;

  @Column({
    type: 'smallint',
  })
  height: number;
}
