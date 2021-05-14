import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageInput } from '@src/common/dtos/pagination.dto';

import { CreateItemInput, UpdateItemInput } from './dtos/item.input';
import { AddItemUrlInput } from './dtos/item-url.input';
import { ItemsRepository } from './items.repository';
import { ItemPrice } from './models/item-price.model';
import { ItemUrl } from './models/item-url.model';
import { Item } from './models/item.model';
import { AddItemPriceInput } from './dtos/item-price.input';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsRepository)
    private readonly itemsRepository: ItemsRepository
  ) {}

  async list(pageInput?: PageInput, relations: string[] = []): Promise<Item[]> {
    const _pageInput = plainToClass(PageInput, pageInput);

    return this.itemsRepository.entityToModelMany(
      await this.itemsRepository.find({
        relations,
        ...(_pageInput?.pageFilter ?? {}),
      })
    );
  }

  async get(id: number, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.get(id, relations);
  }

  async create(
    createItemInput: CreateItemInput,
    relations: string[]
  ): Promise<Item> {
    const { priceInput, urlInput, ...itemAttributes } = createItemInput;

    const item = new Item({
      ...itemAttributes,
      prices: [new ItemPrice(priceInput)],
      urls: [new ItemUrl(urlInput)],
    });
    const newEntity = await this.itemsRepository.save(item);
    return await this.get(newEntity.id, relations);
  }

  async findOne(param: Partial<Item>, relations: string[] = []): Promise<Item> {
    return await this.itemsRepository.findOneEntity(param, relations);
  }

  async addUrl(item: Item, addItemUrlInput: AddItemUrlInput): Promise<ItemUrl> {
    const url = item.addUrl(addItemUrlInput);
    await this.itemsRepository.save(item);
    return url;
  }

  async addPrice(
    item: Item,
    addItemPriceInput: AddItemPriceInput
  ): Promise<ItemPrice> {
    const price = item.addPrice(addItemPriceInput);
    await this.itemsRepository.save(item);
    return price;
  }

  async removePrice(item: Item, priceId: number): Promise<Item> {
    const price = item.removePrice(priceId);
    await price.remove();
    return await this.itemsRepository.save(item);
  }

  async updateById(
    item: Item,
    updateItemInput: UpdateItemInput
  ): Promise<Item> {
    return await this.itemsRepository.updateEntity(item, updateItemInput);
  }
}
