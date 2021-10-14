import { ItemDetailImage } from '../models';

export class ItemDetailImageFactory {
  static from(url: string,order:number): ItemDetailImage {
    return new ItemDetailImage({
      key: new URL(url).pathname.slice(1),
      order
    });
  }
}
