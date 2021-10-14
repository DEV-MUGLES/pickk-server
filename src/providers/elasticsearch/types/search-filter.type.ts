export type SearchMultiMatchPrefixFilter = {
  multi_match: {
    query: string;
    type: 'phrase_prefix';
  };
};

export type SearchMatchFilter = {
  match_phrase: Record<string, unknown>;
};

export type SearchInFilter = {
  bool: {
    should: SearchMatchFilter[];
    minimum_should_match: 1;
  };
};

export type SearchRangeFilter = {
  range: Record<
    string,
    { gt?: unknown; gte?: unknown; lt?: unknown; lte?: unknown }
  >;
};

export type SearchExistsFilter = {
  exists: { field: string };
};

export type SearchFilter =
  | SearchMultiMatchPrefixFilter
  | SearchMatchFilter
  | SearchInFilter
  | SearchRangeFilter
  | SearchExistsFilter;
