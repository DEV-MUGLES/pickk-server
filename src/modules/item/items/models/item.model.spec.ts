import * as faker from 'faker';

import { AddItemUrlInput } from '../dtos/item-url.input';
import { Item } from './item.model';

describe('Item', () => {
  describe('addUrl', () => {
    const addItemUrlInput: AddItemUrlInput = {
      url: faker.internet.url(),
      isPrimary: true,
    };

    it('shoud return added url', () => {
      const item = new Item();
      const result = item.addUrl(addItemUrlInput);
      expect(result).toMatchObject(addItemUrlInput);
    });

    it('shoud first url be primary', () => {
      addItemUrlInput.isPrimary = false;
      const item = new Item();
      const result = item.addUrl(addItemUrlInput);
      expect(result).toMatchObject({
        ...addItemUrlInput,
        isPrimary: true,
      });
    });
  });
});
