import { ApiProperty } from '@nestjs/swagger';
import { ISpiderItem } from '../interfaces/spider.interface';

export class SpiderItem implements ISpiderItem {
  @ApiProperty()
  name: string;
  @ApiProperty()
  brandKor: string;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  originalPrice: number;
  @ApiProperty()
  salePrice: number;
  @ApiProperty()
  isSoldout?: boolean;
  @ApiProperty()
  images?: string[];
  @ApiProperty()
  url: string;
}
