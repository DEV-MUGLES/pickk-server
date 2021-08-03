import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

import { IJob } from '../interfaces';

@Entity({ name: 'job' })
export class JobEntity extends BaseEntity implements IJob {
  constructor(attributes?: Partial<JobEntity>) {
    super();
    if (!attributes) {
      return;
    }
    this.name = attributes.name;
    this.createdAt = attributes.createdAt;
    this.updatedAt = attributes.updatedAt;
  }

  @PrimaryColumn({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
