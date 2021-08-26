export type SearchParams = {
  /** timeout. 만료시 그때까지 확인된 hit을 반환합니다. 검색 취소 메커니즘에 의해 취소될 수 있다.
   * - Ref: {@link https://www.elastic.co/guide/en/elasticsearch/reference/6.7/search.html#global-search-cancellation Search Cancellation Mechanism} /
   * {@link https://www.elastic.co/guide/en/elasticsearch/reference/6.7/common-options.html#time-units Time Units}
   */
  timeout?: string;

  /** hit 조회를 시작할 offset(=offset)
   * @default 0 */
  from?: number;

  /** 조회할 hit의 개수(=limit) 반환되는 hit 없이 일치하는 개수만 새고 싶을 때 0으로 설정하면 성능상 좋다.
   * @default 10 */
  size?: number;

  /** 실행할 검색 방식
   * - Ref: {@link https://www.elastic.co/guide/en/elasticsearch/reference/6.7/search-request-search-type.html Search Type Reference}
   * @default 'dfs_query_then_fetch'
   */
  search_type?: 'dfs_query_then_fetch' | 'query_then_fetch';

  /** 활성화시 size=0인 검색 결과들을 캐싱한다.
   * - Ref: {@link https://www.elastic.co/guide/en/elasticsearch/reference/6.7/shard-request-cache.html Shard request cache}
   */
  request_cache?: boolean;

  /** 검색 결과중 일부만 반환되는 것을 허용할 것인가.
   * @default false */
  allow_partial_search_results?: boolean;

  /** 쿼리가 일찍 끝났을 때 각 Shard에 수집될 수 있는 document의 최대 수
   * @default 0 */
  terminate_after?: number;

  /** 하나의 node에서 한번에 reduce될 Shart result의 개수. Shard가 많이 생성됐을 때 메모리 부하를 줄이기 위해 사용된다. */
  batched_reduce_size?: number;
};
