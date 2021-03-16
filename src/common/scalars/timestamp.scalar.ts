import { GraphQLScalarType, Kind, ValueNode } from 'graphql';

const SEOUL_TIMEZONE = 3600 * 9;

export const Timestamp = new GraphQLScalarType({
  name: 'Timestamp',
  description:
    'Date type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch.',
  parseValue(value: number): Date {
    return new Date((value + SEOUL_TIMEZONE) * 1000); // value from the client
  },
  serialize(value: number): Date {
    return new Date((value + SEOUL_TIMEZONE) * 1000); // value sent to the client
  },
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});
