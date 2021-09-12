import { ItemDetailImage } from '../models';

export class ItemDetailImageFactory {
  static from(url: string): ItemDetailImage {
    return new ItemDetailImage({
      key: new URL(url).pathname.slice(1),
    });
  }
}
