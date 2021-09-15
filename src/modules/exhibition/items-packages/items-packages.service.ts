import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ItemsPackageRelationType } from './constants';
import { ItemsPackage, ItemsPackageItem } from './models';

import {
  ItemsPackageItemsRepository,
  ItemsPackagesRepository,
} from './items-packages.repository';

@Injectable()
export class ItemsPackagesService {
  constructor(
    @InjectRepository(ItemsPackagesRepository)
    private readonly itemsPackagesRepository: ItemsPackagesRepository,
    @InjectRepository(ItemsPackageItemsRepository)
    private readonly itemsPackageItemsRepository: ItemsPackageItemsRepository
  ) {}

  async findByCode(
    code: string,
    relations: ItemsPackageRelationType[] = []
  ): Promise<ItemsPackage> {
    const itemsPackage = await this.itemsPackagesRepository.findOneEntity(
      {
        code,
      },
      relations
    );

    if (!itemsPackage) {
      throw new NotFoundException();
    }

    return itemsPackage;
  }

  async updateItems(code: string, itemIds: number[]): Promise<void> {
    const itemsPackage = await this.findByCode(code, ['packageItems']);

    await this.itemsPackageItemsRepository.remove(itemsPackage.packageItems);

    itemsPackage.packageItems = itemIds.map(
      (itemId, index) =>
        new ItemsPackageItem({
          itemId,
          order: index,
        })
    );

    await this.itemsPackagesRepository.save(itemsPackage);
  }
}
