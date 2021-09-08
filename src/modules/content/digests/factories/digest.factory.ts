import { Digest } from '../models';

export class DigestFactory {
  static from(attrs: Partial<Digest>, imageUrls?: string[]) {
    const digest = new Digest(attrs);
    if (imageUrls) {
      digest.createDigestImages(imageUrls);
    }
    return digest;
  }
}
