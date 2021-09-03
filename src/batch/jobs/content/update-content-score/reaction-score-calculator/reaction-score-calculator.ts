import { CommentOwnerType } from '@content/comments/constants';
import { LikeOwnerType } from '@content/likes/constants';

export abstract class ReactionScoreCalculator {
  private firstDiffWeight = 0.25;
  private secondDiffWeight = 0.05;
  protected weight: number;

  protected abstract getDiffs(
    id: number,
    ownerType?: LikeOwnerType | CommentOwnerType
  ): Promise<number[]>;

  async calculateScore(
    id: number,
    ownerType?: LikeOwnerType | CommentOwnerType
  ) {
    const [firstDiff, secondDiff] = await this.getDiffs(id, ownerType);
    return (
      (firstDiff * this.firstDiffWeight + secondDiff * this.secondDiffWeight) *
      this.weight
    );
  }
}
