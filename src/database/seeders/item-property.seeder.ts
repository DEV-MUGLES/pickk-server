import { Injectable } from '@nestjs/common';

import { ItemPropertiesRepository } from '@item/item-properties/item-properties.repository';
import { ItemProperty, ItemPropertyValue } from '@item/item-properties/models';

import { BaseSeeder } from './base.seeder';

@Injectable()
export class ItemPropertySeeder extends BaseSeeder {
  constructor(
    private readonly itemPropertiesRepository: ItemPropertiesRepository
  ) {
    super();
  }

  async seed(): Promise<void> {
    const itemProperties = ITEM_PROPERTY_SEED_DATA.map((data) => {
      const { minorCategoryId, props } = data;
      return props.map((p) => {
        const { name, values } = p;
        const itemPropertyValues = values.map(
          (v, i) => new ItemPropertyValue({ name: v, order: i })
        );

        return new ItemProperty({
          minorCategoryId,
          name,
          values: itemPropertyValues,
        });
      });
    });

    await this.itemPropertiesRepository.save(
      itemProperties.reduce(
        (flatItemProperties, value) => flatItemProperties.concat(...value),
        []
      )
    );
  }
}

const ITEM_PROPERTY_SEED_DATA: {
  minorCategoryId: number;
  props: { name: string; values: string[] }[];
}[] = [
  {
    minorCategoryId: 63,
    props: [
      {
        name: '종류',
        values: [
          '싱글라이더재킷',
          '더블라이더재킷',
          '봄버재킷',
          '무스탕',
          '기타레더재킷',
        ],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '겉감',
        values: ['인조가죽', '소가죽', '양가죽', '기타천연가죽'],
      },
    ],
  },
  {
    minorCategoryId: 64,
    props: [
      {
        name: '종류',
        values: ['싱글블레이저', '더블블레이저', '기타블레이저'],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '겉감',
        values: ['합성섬유', '울(혼방)', '코튼', '린넨', '코듀로이', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 65,
    props: [
      { name: '종류', values: ['트러커재킷', '미니멀재킷'] },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '겉감',
        values: [
          '데님',
          '코튼',
          '합성섬유',
          '울(혼방)',
          '스웨이드',
          '코듀로이',
          '기타',
        ],
      },
    ],
  },
  {
    minorCategoryId: 66,
    props: [
      {
        name: '종류',
        values: ['바람막이', '아노락', '트랙탑', '코치재킷', '기타나일론재킷'],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      { name: '후드', values: ['없음', '있음'] },
    ],
  },
  {
    minorCategoryId: 67,
    props: [
      {
        name: '종류',
        values: ['트렌치코트', '발마칸/맥코트', '싱글코트', '기타환절기코트'],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '겉감',
        values: ['합성섬유', '코튼', '울(혼방)', '캐시미어(혼방)', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 68,
    props: [
      {
        name: '종류',
        values: [
          '싱글코트',
          '발마칸/맥코트',
          '더블코트',
          '후드코트',
          '피코트',
          '기타겨울코트',
        ],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '겉감',
        values: ['울(혼방)', '캐시미어(혼방)', '합성섬유', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 69,
    props: [
      { name: '종류', values: ['MA-1', '블루종', '스타디움재킷'] },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '겉감',
        values: ['나일론', '합성섬유', '울(혼방)', '코튼', '스웨이드', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 70,
    props: [
      { name: '종류', values: ['플리스재킷'] },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      { name: '후드', values: ['없음', '있음'] },
    ],
  },
  {
    minorCategoryId: 71,
    props: [
      { name: '종류', values: ['가디건'] },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '겉감',
        values: [
          '합성섬유',
          '울(혼방)',
          '캐시미어(혼방)',
          '모헤어',
          '코튼',
          '기타',
        ],
      },
    ],
  },
  {
    minorCategoryId: 72,
    props: [
      { name: '종류', values: ['롱패딩', '점퍼패딩', '숏패딩', '경량패딩'] },
      { name: '충전재', values: ['오리털', '거위털', '인공충전재'] },
      { name: '후드', values: ['없음', '있음'] },
    ],
  },
  {
    minorCategoryId: 73,
    props: [
      {
        name: '종류',
        values: ['패딩베스트', '니트베스트', '코튼베스트', '기타베스트'],
      },
      { name: '넥라인', values: ['라운드넥', '브이넥', '기타'] },
    ],
  },
  {
    minorCategoryId: 74,
    props: [
      { name: '종류', values: ['야상', '헌팅재킷', '퀼팅재킷', '기타아우터'] },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
    ],
  },
  {
    minorCategoryId: 75,
    props: [
      {
        name: '종류',
        values: ['무지반팔티', '프린팅반팔티', '반팔카라티', '기타반팔티'],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      { name: '두께감', values: ['얇음', '보통', '두꺼움'] },
    ],
  },
  {
    minorCategoryId: 76,
    props: [
      {
        name: '종류',
        values: [
          '무지긴팔티',
          '프린팅긴팔티',
          '스트라이프긴팔티',
          '긴팔카라티',
          '기타긴팔티',
        ],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      { name: '두께감', values: ['얇음', '보통', '두꺼움'] },
    ],
  },
  {
    minorCategoryId: 77,
    props: [
      {
        name: '종류',
        values: [
          '반팔셔츠',
          '긴팔셔츠',
          '오픈카라셔츠',
          '헨리넥셔츠',
          '차이나카라셔츠',
          '기타셔츠',
        ],
      },
      { name: '핏', values: ['오버핏', '루즈핏', '레귤러/슬림핏'] },
      {
        name: '소재',
        values: ['코튼', '린넨', '실키원단', '데님', '울(혼방)', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 78,
    props: [
      {
        name: '종류',
        values: ['반팔니트', '긴팔니트', '카라니트', '터틀넥니트', '기타니트'],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      {
        name: '소재',
        values: [
          '합성섬유',
          '울(혼방)',
          '캐시미어(혼방)',
          '모헤어',
          '코튼',
          '기타',
        ],
      },
    ],
  },
  {
    minorCategoryId: 79,
    props: [
      {
        name: '종류',
        values: ['무지맨투맨', '프린팅맨투맨', '아노락맨투맨', '기타맨투맨'],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      { name: '두께감', values: ['얇음', '보통', '두꺼움'] },
    ],
  },
  {
    minorCategoryId: 80,
    props: [
      {
        name: '종류',
        values: ['무지후드티', '프린팅후드티', '후드집업', '기타후드티'],
      },
      { name: '핏', values: ['오버핏', '세미오버핏', '레귤러/슬림핏'] },
      { name: '두께감', values: ['얇음', '보통', '두꺼움'] },
    ],
  },
  {
    minorCategoryId: 81,
    props: [
      {
        name: '종류',
        values: [
          '내복용민소매티',
          '레이어드용민소매티',
          '기능성/단품용맨소매티',
          '기타맨소매티',
        ],
      },
    ],
  },
  {
    minorCategoryId: 82,
    props: [
      {
        name: '종류',
        values: [
          '크림데님팬츠',
          '연청데님팬츠',
          '중청데님팬츠',
          '진청데님팬츠',
          '흑청데님팬츠',
          '기타데님팬츠',
        ],
      },
      { name: '핏', values: ['와이드핏', '세미와이드핏', '테이퍼드/슬림핏'] },
      { name: '기장', values: ['크롭', '보통', '롱'] },
    ],
  },
  {
    minorCategoryId: 83,
    props: [
      {
        name: '종류',
        values: ['치노팬츠', '린넨팬츠', '코듀로이팬츠', '기타코튼팬츠'],
      },
      {
        name: '핏',
        values: ['와이드핏', '세미와이드핏', '레귤러핏', '슬림핏'],
      },
      { name: '기장', values: ['크롭', '보통', '롱'] },
    ],
  },
  {
    minorCategoryId: 84,
    props: [
      {
        name: '종류',
        values: [
          '스웻팬츠',
          '나일론팬츠',
          '조거팬츠',
          '트랙팬츠',
          '기타트레이닝팬츠',
        ],
      },
      {
        name: '핏',
        values: ['와이드핏', '세미와이드핏', '레귤러핏', '슬림핏'],
      },
    ],
  },
  {
    minorCategoryId: 85,
    props: [
      {
        name: '종류',
        values: [
          '숏치노팬츠',
          '숏린넨팬츠',
          '숏슬랙스',
          '숏스웻팬츠',
          '숏나일론팬츠',
          '숏데님팬츠',
          '기타숏팬츠',
        ],
      },
      {
        name: '핏',
        values: ['와이드핏', '세미와이드핏', '레귤러핏', '슬림핏'],
      },
      { name: '기장', values: ['허벅지중간', '무릎바로위', '무릎아래'] },
    ],
  },
  {
    minorCategoryId: 86,
    props: [
      {
        name: '종류',
        values: ['울 슬랙스', '슬랙스', '플리츠팬츠', '기타슬랙스'],
      },
      { name: '핏', values: ['와이드핏', '세미와이드핏', '테이퍼드/슬림핏'] },
      { name: '기장', values: ['크롭', '보통', '롱'] },
    ],
  },
  {
    minorCategoryId: 87,
    props: [
      {
        name: '종류',
        values: [
          '캔버스화',
          '레더스니커즈',
          '독일군',
          '슬립온',
          '뮬',
          '기타단화',
        ],
      },
      { name: '굽높이', values: ['낮음', '보통', '높음'] },
    ],
  },
  {
    minorCategoryId: 88,
    props: [
      { name: '종류', values: ['런닝화', '어글리슈즈', '농구화'] },
      { name: '굽높이', values: ['낮음', '보통', '높음'] },
    ],
  },
  {
    minorCategoryId: 89,
    props: [
      {
        name: '종류',
        values: [
          '라운드토더비',
          '스퀘어토더비',
          '모크슈즈',
          '옥스포드화',
          '기타구두',
        ],
      },
      { name: '소재', values: ['인조가죽', '천연가죽', '스웨이드', '기타'] },
    ],
  },
  {
    minorCategoryId: 90,
    props: [
      {
        name: '종류',
        values: [
          '라운드토첼시',
          '스퀘어토첼시',
          '로우워커',
          '하이워커',
          '기타부츠',
        ],
      },
      { name: '굽높이', values: ['인조가죽', '천연가죽', '스웨이드', '기타'] },
    ],
  },
  {
    minorCategoryId: 91,
    props: [
      {
        name: '종류',
        values: [
          '플레인로퍼',
          '페니로퍼',
          '블로퍼',
          '모카신/보트슈즈',
          '태슬로퍼',
          '기타로퍼',
        ],
      },
      { name: '소재', values: ['인조가죽', '천연가죽', '스웨이드', '기타'] },
    ],
  },
  {
    minorCategoryId: 92,
    props: [
      { name: '종류', values: ['샌들', '슬리퍼', '쪼리', '기타여름신발'] },
      { name: '소재', values: ['인조가죽', '천연가죽', '고무', '패브릭'] },
    ],
  },
  {
    minorCategoryId: 93,
    props: [
      { name: '종류', values: ['기타신발'] },
      {
        name: '주요소재',
        values: ['고무', '인조가죽', '천연가죽', '캔버스', '스웨이드', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 94,
    props: [
      {
        name: '종류',
        values: ['아웃도어백팩', '캠퍼스백팩', '오피스백팩', '기타백팩'],
      },
      {
        name: '주요소재',
        values: ['합성섬유', '코튼/캔버스', '인조가죽', '천연가죽', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 95,
    props: [
      { name: '종류', values: ['숄더백', '토트백', '에코백', '기타숄더백'] },
      {
        name: '주요소재',
        values: ['합성섬유', '코튼/캔버스', '인조가죽', '천연가죽', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 96,
    props: [
      {
        name: '종류',
        values: [
          '크로스백',
          '메신저백',
          '샤코슈',
          '웨이스트백',
          '슬링백',
          '기타크로스백',
        ],
      },
      {
        name: '주요소재',
        values: ['합성섬유', '코튼/캔버스', '인조가죽', '천연가죽', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 97,
    props: [
      { name: '종류', values: ['파우치', '클러치'] },
      {
        name: '주요소재',
        values: ['합성섬유', '코튼/캔버스', '인조가죽', '천연가죽', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 98,
    props: [
      { name: '종류', values: ['기타가방'] },
      {
        name: '주요소재',
        values: ['합성섬유', '코튼/캔버스', '인조가죽', '천연가죽', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 99,
    props: [
      {
        name: '종류',
        values: ['야구모자', '캠프캡', '버킷햇', '비니', '기타모자'],
      },
      {
        name: '주요소재',
        values: [
          '합성섬유',
          '코튼',
          '울(혼방)',
          '데님',
          '스웨이드',
          '코듀로이',
          '기타',
        ],
      },
    ],
  },
  {
    minorCategoryId: 100,
    props: [
      { name: '종류', values: ['벨트'] },
      { name: '주요소재', values: ['인조가죽', '천연가죽', '패브릭', '기타'] },
    ],
  },
  {
    minorCategoryId: 101,
    props: [
      { name: '종류', values: ['머플러'] },
      {
        name: '주요소재',
        values: ['울(혼방)', '캐시미어(혼방)', '합성섬유', '코튼', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 102,
    props: [
      { name: '종류', values: ['아날로그시계', '디지털시계', '스마트워치'] },
      { name: '스트랩', values: ['메탈', '가죽', '고무', '패브릭', '기타'] },
    ],
  },
  {
    minorCategoryId: 103,
    props: [
      { name: '종류', values: ['선글라스'] },
      { name: '렌즈색상', values: ['블랙', '틴트', '미러'] },
    ],
  },
  {
    minorCategoryId: 104,
    props: [
      { name: '종류', values: ['팔찌'] },
      {
        name: '소재',
        values: ['스틸', '실버', '골드', '레더', '원석', '패브릭', '기타'],
      },
    ],
  },
  {
    minorCategoryId: 105,
    props: [
      { name: '종류', values: ['반지'] },
      { name: '소재', values: ['스틸', '실버', '골드', '기타'] },
    ],
  },
  {
    minorCategoryId: 106,
    props: [
      { name: '종류', values: ['목걸이'] },
      { name: '소재', values: ['스틸', '실버', '골드', '기타'] },
    ],
  },
  {
    minorCategoryId: 107,
    props: [
      {
        name: '종류',
        values: [
          '스킨케어',
          '향수',
          '헤어용품',
          '메이크업',
          '쉐이빙',
          '기타그루밍',
        ],
      },
    ],
  },
  {
    minorCategoryId: 108,
    props: [
      {
        name: '종류',
        values: ['장갑', '넥타이', '스카프', '키링', '기타악세사리'],
      },
    ],
  },
];
