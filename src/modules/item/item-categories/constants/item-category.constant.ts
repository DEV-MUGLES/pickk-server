import { PredefinedCategoryCode } from './item-category.enum';

export const ItemCategoryData: {
  name: string;
  code: PredefinedCategoryCode;
  minorCategories: { id: number; name: string; code: PredefinedCategoryCode }[];
}[] = [
  {
    name: '아우터',
    code: PredefinedCategoryCode.OUTER,
    minorCategories: [
      {
        id: 63,
        code: PredefinedCategoryCode.LEATHER_JACHKET,
        name: '레더 재킷',
      },
      {
        id: 64,
        code: PredefinedCategoryCode.BLAZER,
        name: '블레이저',
      },
      {
        id: 65,
        code: PredefinedCategoryCode.TRUCKER_JACKET,
        name: '트러커 재킷',
      },
      {
        id: 66,
        code: PredefinedCategoryCode.COACH_JACKET,
        name: '나일론, 코치 재킷',
      },
      {
        id: 67,
        code: PredefinedCategoryCode.LIGHT_COAT,
        name: '환절기 코트',
      },
      {
        id: 68,
        code: PredefinedCategoryCode.HEAVY_COAT,
        name: '겨울 코트',
      },
      {
        id: 69,
        code: PredefinedCategoryCode.BLOUSON,
        name: '블루종, MA-1',
      },
      {
        id: 70,
        code: PredefinedCategoryCode.FLEECE,
        name: '플리스',
      },
      {
        id: 71,
        code: PredefinedCategoryCode.CARDIGAN,
        name: '가디건',
      },
      {
        id: 72,
        code: PredefinedCategoryCode.PADDING,
        name: '패딩',
      },
      {
        id: 73,
        code: PredefinedCategoryCode.VEST,
        name: '베스트',
      },
      {
        id: 74,
        code: PredefinedCategoryCode.ETC_OUTER,
        name: '기타 아우터',
      },
    ],
  },
  {
    name: '상의',
    code: PredefinedCategoryCode.TOP,
    minorCategories: [
      {
        id: 75,
        code: PredefinedCategoryCode.SHORT_TSHIRT,
        name: '반팔 티셔츠',
      },
      {
        id: 76,
        code: PredefinedCategoryCode.LONG_TSHIRT,
        name: '긴팔 티셔츠',
      },
      {
        id: 77,
        code: PredefinedCategoryCode.SHIRT,
        name: '셔츠',
      },
      {
        id: 78,
        code: PredefinedCategoryCode.KNIT,
        name: '니트',
      },
      {
        id: 79,
        code: PredefinedCategoryCode.SWEATSHIRT,
        name: '맨투맨',
      },
      {
        id: 80,
        code: PredefinedCategoryCode.HOOD,
        name: '후드티, 집업',
      },
      {
        id: 81,
        code: PredefinedCategoryCode.SLEEVELESS,
        name: '민소매 티셔츠',
      },
    ],
  },
  {
    name: '하의',
    code: PredefinedCategoryCode.BOTTOM,
    minorCategories: [
      {
        id: 82,
        code: PredefinedCategoryCode.DENIM_PANTS,
        name: '데님 팬츠',
      },
      {
        id: 83,
        code: PredefinedCategoryCode.COTTON_PANTS,
        name: '코튼 팬츠',
      },
      {
        id: 84,
        code: PredefinedCategoryCode.TRAINING_PANTS,
        name: '트레이닝, 조거 팬츠',
      },
      {
        id: 85,
        code: PredefinedCategoryCode.SHORT_PANTS,
        name: '숏 팬츠',
      },
      {
        id: 86,
        code: PredefinedCategoryCode.SLACKS,
        name: '슬랙스',
      },
    ],
  },
  {
    name: '신발',
    code: PredefinedCategoryCode.SHOES,
    minorCategories: [
      {
        id: 87,
        code: PredefinedCategoryCode.CANVAS,
        name: '캔버스, 단화',
      },
      {
        id: 88,
        code: PredefinedCategoryCode.RUNNING_SHOES,
        name: '운동화',
      },
      {
        id: 89,
        code: PredefinedCategoryCode.DRESS_SHOES,
        name: '구두',
      },
      {
        id: 90,
        code: PredefinedCategoryCode.BOOTS,
        name: '부츠',
      },
      {
        id: 91,
        code: PredefinedCategoryCode.LOAFER,
        name: '로퍼',
      },
      {
        id: 92,
        code: PredefinedCategoryCode.SANDAL_SLIPPER,
        name: '샌들, 슬리퍼',
      },
      {
        id: 93,
        code: PredefinedCategoryCode.ETC_SHOES,
        name: '기타 신발',
      },
    ],
  },
  {
    name: '가방',
    code: PredefinedCategoryCode.BAG,
    minorCategories: [
      {
        id: 94,
        code: PredefinedCategoryCode.BACKPACK,
        name: '백팩',
      },
      {
        id: 95,
        code: PredefinedCategoryCode.SHOULDER_BAG,
        name: '숄더백',
      },
      {
        id: 96,
        code: PredefinedCategoryCode.CROSS_BAG,
        name: '크로스백',
      },
      {
        id: 97,
        code: PredefinedCategoryCode.CLUTCH_POUCH,
        name: '클러치, 파우치',
      },
      {
        id: 98,
        code: PredefinedCategoryCode.ETC_BAG,
        name: '기타 가방',
      },
    ],
  },
  {
    name: '악세서리',
    code: PredefinedCategoryCode.ACC,
    minorCategories: [
      {
        id: 99,
        code: PredefinedCategoryCode.HAT,
        name: '모자',
      },
      {
        id: 100,
        code: PredefinedCategoryCode.BELT,
        name: '벨트',
      },
      {
        id: 101,
        code: PredefinedCategoryCode.MUFFLER,
        name: '머플러',
      },
      {
        id: 102,
        code: PredefinedCategoryCode.WATCH,
        name: '시계',
      },
      {
        id: 103,
        code: PredefinedCategoryCode.SUNGLASSES,
        name: '선글라스',
      },
      {
        id: 104,
        code: PredefinedCategoryCode.BRACLET,
        name: '팔찌',
      },
      {
        id: 105,
        code: PredefinedCategoryCode.RING,
        name: '반지',
      },
      {
        id: 106,
        code: PredefinedCategoryCode.NECKLACE,
        name: '목걸이',
      },
      {
        id: 107,
        code: PredefinedCategoryCode.GROOMING,
        name: '그루밍',
      },
      {
        id: 108,
        code: PredefinedCategoryCode.ETC_ACC,
        name: '기타 악세사리 ',
      },
    ],
  },
];
