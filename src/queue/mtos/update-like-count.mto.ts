export type UpdateLikeCountDiff = 1 | -1;

export class UpdateLikeCountMto {
  id: number;
  diff: UpdateLikeCountDiff;
}
