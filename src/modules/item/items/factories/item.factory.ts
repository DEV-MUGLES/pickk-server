import { CreateItemInput } from '../dtos';
import { Item, ItemPrice, ItemUrl } from '../models';

export class ItemFactory {
  static from(input: CreateItemInput): Item {
    const { priceInput, urlInput, ...itemAttributes } = input;

    return new Item({
      ...itemAttributes,
      prices: [new ItemPrice({ ...priceInput, isActive: true, isBase: true })],
      urls: [new ItemUrl({ ...urlInput, isPrimary: true })],
    });
  }
}
