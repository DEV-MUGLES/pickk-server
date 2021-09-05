import { IDigestsExhibitionDigest } from './digests-exhibition-digest.interface';

export interface IDigestsExhibition {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  exhibitionDigests: IDigestsExhibitionDigest[];
}
