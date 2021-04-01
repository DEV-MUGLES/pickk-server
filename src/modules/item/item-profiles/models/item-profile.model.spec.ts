import * as faker from 'faker';

import { AddItemProfileUrlInput } from '../dtos/item-profile-url.input';
import { ItemProfile } from './item-profile.model';

describe('ItemProfile', () => {
  describe('addUrl', () => {
    const addItemProfileUrlInput: AddItemProfileUrlInput = {
      url: faker.internet.url(),
      isPrimary: true,
    };

    it('shoud return added url', () => {
      const itemProfile = new ItemProfile();
      const result = itemProfile.addUrl(addItemProfileUrlInput);
      expect(result).toMatchObject(addItemProfileUrlInput);
    });

    it('shoud first url be primary', () => {
      addItemProfileUrlInput.isPrimary = false;
      const itemProfile = new ItemProfile();
      const result = itemProfile.addUrl(addItemProfileUrlInput);
      expect(result).toMatchObject({
        ...addItemProfileUrlInput,
        isPrimary: true,
      });
    });
  });
});
