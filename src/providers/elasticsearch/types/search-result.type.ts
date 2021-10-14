export type SearchResult<SearchBody extends { id: number | string }> = {
  hits: {
    total: { value: number };
    hits: Array<{
      _source: SearchBody;
    }>;
  };
};
