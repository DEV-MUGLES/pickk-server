import { IItemProfile } from './item-profile.interface';

export interface IItemProfileUrl {
  url: string;
  isPrimary: boolean;
  isAvailable: boolean;
  itemProfile: IItemProfile;
}
