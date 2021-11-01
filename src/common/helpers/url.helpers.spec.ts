import { parse2UrlString, removeProtocolFrom } from './url.helpers';

describe('parse2UrlString', () => {
  it('null또는 undefined을 입력받으면, null을 반환한다', () => {
    expect(parse2UrlString(undefined)).toBeNull();
    expect(parse2UrlString(null)).toBeNull();
  });

  it('protocol이 없는 url문자열을 입력받으면, http프로토콜을 추가하여 반환한다.', () => {
    const strings = [
      'belier.co.kr/product/detail.html?product_no=1292&cate_no=24&display_group=1',
      'garment-lable.com/product/snap-collarless-blouson-black/222/category/48/display/1/',
      'monosewing.com/product/thats-lifeblack-회원가입-시-추가-20-쿠폰/1184/category/32/display/1/',
    ];
    for (const str of strings) {
      expect(parse2UrlString(str)).toBe(`http://${str}`);
    }
  });

  it('유효한 url문자열을 입력받으면, 입력받은 문자열을 반환한다.', () => {
    const strings = [
      'https://belier.co.kr/product/detail.html?product_no=1292&cate_no=24&display_group=1',
      'http://suare.co.kr/product/detail.html?product_no=426&cate_no=27&display_group=1',
      'https://store.musinsa.com/app/product/detail/1183495/0',
    ];
    for (const str of strings) {
      expect(parse2UrlString(str)).toBe(str);
    }
  });
});

describe('removeProtocolFrom', () => {
  it('null또는 undefined를 입력받으면, null을 반환한다', () => {
    expect(removeProtocolFrom(null)).toBeNull();
    expect(removeProtocolFrom(undefined)).toBeNull();
  });

  it('유효하지 않은 url문자열을 입력받으면, null을 반환한다', () => {
    const inValidUrls = [
      'http:// shouldfail.com',
      'file:///blah/index.html',
      'http://..',
      'http://##',
      '//a',
      'http://.www.foo.bar/',
    ];
    for (const url of inValidUrls) {
      expect(removeProtocolFrom(url)).toBeNull();
    }
  });

  it('유효한 url문자열을 입력받으면, protocol을 제거한 url문자열을 반환한다', () => {
    const urls = [
      'https://belier.co.kr/product/detail.html?product_no=1292&cate_no=24&display_group=1',
      'http://suare.co.kr/product/detail.html?product_no=426&cate_no=27&display_group=1',
      'https://store.musinsa.com/app/product/detail/1183495/0',
    ];

    for (const url of urls) {
      expect(removeProtocolFrom(url)).toBe(url.split('//')[1]);
    }
  });
});
