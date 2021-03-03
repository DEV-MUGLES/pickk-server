import { ModelEntity } from 'src/common/serializers/model.serializer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser } from '../interfaces/user.interface';

/**
 * Entity Schema for user.
 *
 * @class
 */
@Entity({
  name: 'user',
})
export class User extends ModelEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ nullable: true, default: null })
  name: string;

  @Column()
  password: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  weight: number;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  height: number;
}
