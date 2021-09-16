import { IImage } from '@common/interfaces';

import { ILook } from './look.interface';

export interface ILookImage extends IImage {
  look: ILook;
  lookId: number;
}
