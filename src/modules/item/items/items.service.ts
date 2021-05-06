import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateItemInput } from './dtos/item-update.input';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsRepository } from './items.repository';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository
  ) {}

  async list(relations: string[] = []): Promise<Item[]> {
    return this.itemsRepository.entityToModelMany(
      await this.itemsRepository.find({ relations })
    );
  }

  async get(id: number, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.get(id, relations);
  }

  async addUrl(item: Item, addItemUrlInput: AddItemUrlInput): Promise<ItemUrl> {
    const url = item.addUrl(addItemUrlInput);
    await this.itemsRepository.save(item);
    return url;
  }

  async updateById(
    item: Item,
    updateItemInput: UpdateItemInput
  ): Promise<Item> {
    return await this.itemsRepository.updateEntity(item, updateItemInput);
  }
}
