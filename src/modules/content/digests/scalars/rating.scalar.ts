import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

export const Rating = new GraphQLScalarType({
  name: 'Rating',
  description:
    '별점을 나타냅니다. 클라이언트로부터 입력 받은 0~5 실수를 0~10 정수로 변환합니다.',
  parseValue(value: number): number {
    return Math.round(value * 2); // value from the client
  },
  serialize(value: number): number {
    return Math.round(value * 2); // value sent to the client
  },
  parseLiteral(ast: ValueNode): number {
    // 내부적으로 value parsing할 때
    if (ast.kind === Kind.INT) {
      return Number(ast.value);
    }
    return null;
  },
});
