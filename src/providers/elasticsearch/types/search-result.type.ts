export type SearchResult<SearchBody extends { id: number }> = {
  hits: {
    total: number;
    hits: Array<{
      _source: SearchBody;
    }>;
  };
};
