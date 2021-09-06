export abstract class ReactionScoreCalculator {
  private firstDiffWeight = 0.25;
  private secondDiffWeight = 0.05;
  protected weight: number;

  calculateScore(diffs: number[]) {
    return (
      (diffs[0] * this.firstDiffWeight + diffs[1] * this.secondDiffWeight) *
      this.weight
    );
  }
}

export class LikeReactionScoreCalculator extends ReactionScoreCalculator {
  weight = 0.05;
}

export class CommentReactionScoreCalculator extends ReactionScoreCalculator {
  weight = 0.025;
}

export class OrderReactionScoreCalculator extends ReactionScoreCalculator {
  weight = 0.05;
}
