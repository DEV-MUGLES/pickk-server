import { PredefinedCategoryCode } from './item-category.enum';

export const ItemCategoryData: {
  name: string;
  code: PredefinedCategoryCode;
  minorCategories: { name: string; code: PredefinedCategoryCode }[];
}[] = [
  {
    name: '아우터',
    code: PredefinedCategoryCode.Outer,
    minorCategories: [
      {
        code: PredefinedCategoryCode.LeatherJacket,
        name: '레더 재킷',
      },
      {
        code: PredefinedCategoryCode.Blazer,
        name: '블레이저',
      },
      {
        code: PredefinedCategoryCode.TruckerJacket,
        name: '트러커 재킷',
      },
      {
        code: PredefinedCategoryCode.CoachJacket,
        name: '나일론, 코치 재킷',
      },
      {
        code: PredefinedCategoryCode.LightCoat,
        name: '환절기 코트',
      },
      {
        code: PredefinedCategoryCode.HeavyCoat,
        name: '겨울 코트',
      },
      {
        code: PredefinedCategoryCode.Blouson,
        name: '블루종, MA-1',
      },
      {
        code: PredefinedCategoryCode.Fleece,
        name: '플리스',
      },
      {
        code: PredefinedCategoryCode.Cardigan,
        name: '가디건',
      },
      {
        code: PredefinedCategoryCode.Padding,
        name: '패딩',
      },
      {
        code: PredefinedCategoryCode.Vest,
        name: '베스트',
      },
      {
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
        code: PredefinedCategoryCode.ShortTshirt,
        name: '반팔 티셔츠',
      },
      {
        code: PredefinedCategoryCode.LongTshirt,
        name: '긴팔 티셔츠',
      },
      {
        code: PredefinedCategoryCode.Shirt,
        name: '셔츠',
      },
      {
        code: PredefinedCategoryCode.Knit,
        name: '니트',
      },
      {
        code: PredefinedCategoryCode.Sweatshirt,
        name: '맨투맨',
      },
      {
        code: PredefinedCategoryCode.Hood,
        name: '후드티, 집업',
      },
      {
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
        code: PredefinedCategoryCode.DenimPants,
        name: '데님 팬츠',
      },
      {
        code: PredefinedCategoryCode.CottonPants,
        name: '코튼 팬츠',
      },
      {
        code: PredefinedCategoryCode.TraningPants,
        name: '트레이닝, 조거 팬츠',
      },
      {
        code: PredefinedCategoryCode.ShortPants,
        name: '숏 팬츠',
      },
      {
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
        code: PredefinedCategoryCode.Canvas,
        name: '캔버스, 단화',
      },
      {
        code: PredefinedCategoryCode.RunningShoes,
        name: '운동화',
      },
      {
        code: PredefinedCategoryCode.DressShoes,
        name: '구두',
      },
      {
        code: PredefinedCategoryCode.Boots,
        name: '부츠',
      },
      {
        code: PredefinedCategoryCode.Loafer,
        name: '로퍼',
      },
      {
        code: PredefinedCategoryCode.SandalSlipper,
        name: '샌들, 슬리퍼',
      },
      {
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
        code: PredefinedCategoryCode.Backpack,
        name: '백팩',
      },
      {
        code: PredefinedCategoryCode.ShoulderBag,
        name: '숄더백',
      },
      {
        code: PredefinedCategoryCode.CrossBag,
        name: '크로스백',
      },
      {
        code: PredefinedCategoryCode.ClutchPouch,
        name: '클러치, 파우치',
      },
      {
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
        code: PredefinedCategoryCode.Hat,
        name: '모자',
      },
      {
        code: PredefinedCategoryCode.Belt,
        name: '벨트',
      },
      {
        code: PredefinedCategoryCode.Muffler,
        name: '머플러',
      },
      {
        code: PredefinedCategoryCode.Watch,
        name: '시계',
      },
      {
        code: PredefinedCategoryCode.Sunglasses,
        name: '선글라스',
      },
      {
        code: PredefinedCategoryCode.Braclet,
        name: '팔찌',
      },
      {
        code: PredefinedCategoryCode.Ring,
        name: '반지',
      },
      {
        code: PredefinedCategoryCode.Necklace,
        name: '목걸이',
      },
      {
        code: PredefinedCategoryCode.Grooming,
        name: '그루밍',
      },
      {
        code: PredefinedCategoryCode.EtcAcc,
        name: '기타 악세사리 ',
      },
    ],
  },
];
