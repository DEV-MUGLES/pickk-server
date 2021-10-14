export type SearchFilter = {
  term?: Record<string, unknown>;
  terms?: Record<string, unknown[]>;
  range?: Record<
    string,
    { gte?: unknown; gt?: unknown; lte?: unknown; lt?: unknown }
  >;
};
