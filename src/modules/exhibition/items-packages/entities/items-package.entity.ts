import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseIdEntity } from '@common/entities';

import { IItemsPackage, IItemsPackageItem } from '../interfaces';

@ObjectType()
@Entity({ name: 'items_package' })
export class ItemsPackageEntity extends BaseIdEntity implements IItemsPackage {
  constructor(attributes?: Partial<ItemsPackageEntity>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.packageItems = attributes.packageItems;
  }

  @Field({ description: '최대 50자' })
  @Column({ unique: true, length: 50 })
  code: string;

  @OneToMany('ItemsPackageItemEntity', 'package', {
    cascade: true,
    onDelete: 'CASCADE',
  })
  packageItems: IItemsPackageItem[];
}
