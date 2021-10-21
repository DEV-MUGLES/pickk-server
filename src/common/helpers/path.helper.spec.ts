import { merge } from './path.helper';

describe('merge', () => {
  it('success', () => {
    const inputs: [string, string, string][] = [
      [
        'http://buttonseoul.com/product/list.html?cate_no=12',
        '/product/detail.html?product_no=651&cate_no=12&display_group=1',
        'http://buttonseoul.com/product/detail.html?product_no=651&cate_no=12&display_group=1',
      ],
      [
        'http://www.thetrillion.co.kr/shop/goods/goods_list.php?category=007002',
        '../goods/goods_view.php?goodsno=238&category=007002',
        'http://www.thetrillion.co.kr/shop/goods/goods_view.php?goodsno=238&category=007002',
      ],
      [
        'http://www.minav.co.kr/product/list.html?cate_no=57',
        '/product/detail.html?product_no=1415&cate_no=57&display_group=1',
        'http://www.minav.co.kr/product/detail.html?product_no=1415&cate_no=57&display_group=1',
      ],
    ];

    for (const [a, b, result] of inputs) {
      expect(merge(a, b)).toEqual(result);
    }
  });
});
