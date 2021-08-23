import { registerEnumType } from '@nestjs/graphql';

export enum KeywordClassType {
  Trending = 'trending',
  Essential = 'essential',
}

registerEnumType(KeywordClassType, {
  name: 'KeywordClassType',
});
