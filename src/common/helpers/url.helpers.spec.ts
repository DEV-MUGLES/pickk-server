import { addHttpTo, removeProtocolFrom } from './url.helpers';

describe('UrlHelpers', () => {
  const invalidUrls = [
    'http:// shouldfail.com',
    'file:///blah/index.html',
    'http://..',
    'http://##',
    '//a',
    'http://.www.foo.bar/',
  ];
  const urlsWithoutProtocol = [
    'belier.co.kr/product/detail.html?product_no=1292&cate_no=24&display_group=1',
    'garment-lable.com/product/snap-collarless-blouson-black/222/category/48/display/1/',
    'monosewing.com/product/thats-lifeblack-회원가입-시-추가-20-쿠폰/1184/category/32/display/1/',
  ];
  const urls = [
    'https://belier.co.kr/product/detail.html?product_no=1292&cate_no=24&display_group=1',
    'http://suare.co.kr/product/detail.html?product_no=426&cate_no=27&display_group=1',
    'https://store.musinsa.com/app/product/detail/1183495/0',
  ];
  describe('addHttpTo', () => {
    it('null또는 undefined을 입력받으면, null을 반환한다', () => {
      expect(addHttpTo(undefined)).toBeNull();
      expect(addHttpTo(null)).toBeNull();
    });
    it('유효하지 않은 url문자열을 입력받으면, null을 반환한다', () => {
      invalidUrls.forEach((url) => {
        expect(addHttpTo(url)).toBeNull();
      });
    });

    it('protocol이 없는 url문자열을 입력받으면, http프로토콜을 추가하여 반환한다.', () => {
      urlsWithoutProtocol.forEach((url) => {
        expect(addHttpTo(url)).toBe(`http://${url}`);
      });
    });

    it('유효한 url문자열을 입력받으면, 입력받은 문자열을 반환한다.', () => {
      urls.forEach((url) => {
        expect(addHttpTo(url)).toBe(url);
      });
    });
  });

  describe('removeProtocolFrom', () => {
    it('null또는 undefined를 입력받으면, null을 반환한다', () => {
      expect(removeProtocolFrom(null)).toBeNull();
      expect(removeProtocolFrom(undefined)).toBeNull();
    });

    it('유효하지 않은 url문자열을 입력받으면, null을 반환한다', () => {
      invalidUrls.forEach((url) => {
        expect(removeProtocolFrom(url)).toBeNull();
      });
    });

    it('protocol이 없는 url문자열을 입력받으면, 입력받은 문자열을 그래도 반환한다', () => {
      urlsWithoutProtocol.forEach((url) => {
        expect(removeProtocolFrom(url)).toBe(url);
      });
    });

    it('유효한 url문자열을 입력받으면, protocol을 제거한 url문자열을 반환한다', () => {
      urls.forEach((url) => {
        expect(removeProtocolFrom(url)).toBe(url.replace(/https?:\/\//, ''));
      });
    });
  });
});
