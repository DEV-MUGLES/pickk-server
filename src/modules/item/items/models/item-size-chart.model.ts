import { Field, ObjectType } from '@nestjs/graphql';

import { ItemSizeChartEntity } from '../entities';

@ObjectType()
export class ItemSizeChart extends ItemSizeChartEntity {
  @Field(() => [String])
  get labels() {
    return JSON.parse(this.serializedLabels) as string[];
  }
  @Field(() => [ItemSize])
  get sizes() {
    return JSON.parse(this.serializedSizes) as ItemSize[];
  }
  @Field(() => [ItemSizeRecommendation], { nullable: true })
  get recommendations() {
    return JSON.parse(
      this.serializedRecommendations
    ) as ItemSizeRecommendation[];
  }
}

@ObjectType()
export class ItemSize {
  @Field()
  name: string;
  @Field(() => [String])
  values: string[];
}

@ObjectType()
export class ItemSizeRecommendation {
  @Field()
  height: number;
  @Field()
  weight: number;
  @Field()
  sizeName: string;
}
