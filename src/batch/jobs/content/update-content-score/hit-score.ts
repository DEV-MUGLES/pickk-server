import dayjs from 'dayjs';

const ADDITIONAL_HOUR = 48;
export abstract class HitScore {
  private createdAt: Date;
  private hitCount: number;

  protected firstIntervalPower: number;
  protected secondIntervalPower: number;
  protected thirdIntervalPower: number;
  protected firstIntervalEndHour: number;
  protected secondIntervalEndHour: number;

  constructor(hitCount: number, createdAt: Date) {
    this.hitCount = hitCount;
    this.createdAt = createdAt;
  }

  get value() {
    return this.hitCount / this.divisor;
  }

  get passedHour() {
    return dayjs().diff(this.createdAt, 'hour');
  }

  get divisor() {
    if (this.isFirstInterval()) {
      return Math.pow(
        this.passedHour + ADDITIONAL_HOUR,
        this.firstIntervalPower
      );
    }
    if (this.isSecondInterval()) {
      return (
        this.getSecondIntervalAdditionalDivisor() +
        Math.pow(
          this.passedHour - this.firstIntervalEndHour,
          this.secondIntervalPower
        )
      );
    }
    return (
      this.getThirdIntervalAdditionalDivisor() +
      Math.pow(
        this.passedHour - this.secondIntervalEndHour,
        this.thirdIntervalPower
      )
    );
  }

  private getSecondIntervalAdditionalDivisor() {
    return Math.pow(
      this.firstIntervalEndHour + ADDITIONAL_HOUR,
      this.firstIntervalPower
    );
  }

  private getThirdIntervalAdditionalDivisor() {
    return (
      Math.pow(
        this.firstIntervalEndHour + ADDITIONAL_HOUR,
        this.firstIntervalPower
      ) +
      Math.pow(
        this.secondIntervalEndHour - this.firstIntervalEndHour,
        this.secondIntervalPower
      )
    );
  }

  private isFirstInterval() {
    return this.passedHour < this.firstIntervalEndHour;
  }

  private isSecondInterval() {
    return (
      this.firstIntervalEndHour <= this.passedHour &&
      this.passedHour > this.secondIntervalEndHour
    );
  }
}

export class DigestHitScore extends HitScore {
  firstIntervalPower = 1;
  secondIntervalPower = 1;
  thirdIntervalPower = 2;
  firstIntervalEndHour = 360;
  secondIntervalEndHour = 960;
}

export class LookHitScore extends HitScore {
  firstIntervalPower = 0.5;
  secondIntervalPower = 1;
  thirdIntervalPower = 2;
  firstIntervalEndHour = 288;
  secondIntervalEndHour = 1008;
}

export class VideoHitScore extends HitScore {
  firstIntervalPower = 1;
  secondIntervalPower = 1.5;
  thirdIntervalPower = 2;
  firstIntervalEndHour = 288;
  secondIntervalEndHour = 1008;
}
