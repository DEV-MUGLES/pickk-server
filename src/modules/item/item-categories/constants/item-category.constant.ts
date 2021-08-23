import { PredefinedCategoryCode } from './item-category.enum';

export const ItemCategoryData: {
  name: string;
  code: PredefinedCategoryCode;
  minorCategories: { id: number; name: string; code: PredefinedCategoryCode }[];
}[] = [
  {
    name: '아우터',
    code: PredefinedCategoryCode.Outer,
    minorCategories: [
      {
        id: 63,
        code: PredefinedCategoryCode.LeatherJacket,
        name: '레더 재킷',
      },
      {
        id: 64,
        code: PredefinedCategoryCode.Blazer,
        name: '블레이저',
      },
      {
        id: 65,
        code: PredefinedCategoryCode.TruckerJacket,
        name: '트러커 재킷',
      },
      {
        id: 66,
        code: PredefinedCategoryCode.CoachJacket,
        name: '나일론, 코치 재킷',
      },
      {
        id: 67,
        code: PredefinedCategoryCode.LightCoat,
        name: '환절기 코트',
      },
      {
        id: 68,
        code: PredefinedCategoryCode.HeavyCoat,
        name: '겨울 코트',
      },
      {
        id: 69,
        code: PredefinedCategoryCode.Blouson,
        name: '블루종, MA-1',
      },
      {
        id: 70,
        code: PredefinedCategoryCode.Fleece,
        name: '플리스',
      },
      {
        id: 71,
        code: PredefinedCategoryCode.Cardigan,
        name: '가디건',
      },
      {
        id: 72,
        code: PredefinedCategoryCode.Padding,
        name: '패딩',
      },
      {
        id: 73,
        code: PredefinedCategoryCode.Vest,
        name: '베스트',
      },
      {
        id: 74,
        code: PredefinedCategoryCode.EtcOuter,
        name: '기타 아우터',
      },
    ],
  },
  {
    name: '상의',
    code: PredefinedCategoryCode.Top,
    minorCategories: [
      {
        id: 75,
        code: PredefinedCategoryCode.ShortTshirt,
        name: '반팔 티셔츠',
      },
      {
        id: 76,
        code: PredefinedCategoryCode.LongTshirt,
        name: '긴팔 티셔츠',
      },
      {
        id: 77,
        code: PredefinedCategoryCode.Shirt,
        name: '셔츠',
      },
      {
        id: 78,
        code: PredefinedCategoryCode.Knit,
        name: '니트',
      },
      {
        id: 79,
        code: PredefinedCategoryCode.Sweatshirt,
        name: '맨투맨',
      },
      {
        id: 80,
        code: PredefinedCategoryCode.Hood,
        name: '후드티, 집업',
      },
      {
        id: 81,
        code: PredefinedCategoryCode.Sleeveless,
        name: '민소매 티셔츠',
      },
    ],
  },
  {
    name: '하의',
    code: PredefinedCategoryCode.Bottom,
    minorCategories: [
      {
        id: 82,
        code: PredefinedCategoryCode.DenimPants,
        name: '데님 팬츠',
      },
      {
        id: 83,
        code: PredefinedCategoryCode.CottonPants,
        name: '코튼 팬츠',
      },
      {
        id: 84,
        code: PredefinedCategoryCode.TraningPants,
        name: '트레이닝, 조거 팬츠',
      },
      {
        id: 85,
        code: PredefinedCategoryCode.ShortPants,
        name: '숏 팬츠',
      },
      {
        id: 86,
        code: PredefinedCategoryCode.Slacks,
        name: '슬랙스',
      },
    ],
  },
  {
    name: '신발',
    code: PredefinedCategoryCode.Shoes,
    minorCategories: [
      {
        id: 87,
        code: PredefinedCategoryCode.Canvas,
        name: '캔버스, 단화',
      },
      {
        id: 88,
        code: PredefinedCategoryCode.RunningShoes,
        name: '운동화',
      },
      {
        id: 89,
        code: PredefinedCategoryCode.DressShoes,
        name: '구두',
      },
      {
        id: 90,
        code: PredefinedCategoryCode.Boots,
        name: '부츠',
      },
      {
        id: 91,
        code: PredefinedCategoryCode.Loafer,
        name: '로퍼',
      },
      {
        id: 92,
        code: PredefinedCategoryCode.SandalSlipper,
        name: '샌들, 슬리퍼',
      },
      {
        id: 93,
        code: PredefinedCategoryCode.EtcShoes,
        name: '기타 신발',
      },
    ],
  },
  {
    name: '가방',
    code: PredefinedCategoryCode.Bag,
    minorCategories: [
      {
        id: 94,
        code: PredefinedCategoryCode.Backpack,
        name: '백팩',
      },
      {
        id: 95,
        code: PredefinedCategoryCode.ShoulderBag,
        name: '숄더백',
      },
      {
        id: 96,
        code: PredefinedCategoryCode.CrossBag,
        name: '크로스백',
      },
      {
        id: 97,
        code: PredefinedCategoryCode.ClutchPouch,
        name: '클러치, 파우치',
      },
      {
        id: 98,
        code: PredefinedCategoryCode.EtcBag,
        name: '기타 가방',
      },
    ],
  },
  {
    name: '악세서리',
    code: PredefinedCategoryCode.Acc,
    minorCategories: [
      {
        id: 99,
        code: PredefinedCategoryCode.Hat,
        name: '모자',
      },
      {
        id: 100,
        code: PredefinedCategoryCode.Belt,
        name: '벨트',
      },
      {
        id: 101,
        code: PredefinedCategoryCode.Muffler,
        name: '머플러',
      },
      {
        id: 102,
        code: PredefinedCategoryCode.Watch,
        name: '시계',
      },
      {
        id: 103,
        code: PredefinedCategoryCode.Sunglasses,
        name: '선글라스',
      },
      {
        id: 104,
        code: PredefinedCategoryCode.Braclet,
        name: '팔찌',
      },
      {
        id: 105,
        code: PredefinedCategoryCode.Ring,
        name: '반지',
      },
      {
        id: 106,
        code: PredefinedCategoryCode.Necklace,
        name: '목걸이',
      },
      {
        id: 107,
        code: PredefinedCategoryCode.Grooming,
        name: '그루밍',
      },
      {
        id: 108,
        code: PredefinedCategoryCode.EtcAcc,
        name: '기타 악세사리 ',
      },
    ],
  },
];
