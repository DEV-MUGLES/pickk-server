import { InternalServerErrorException } from '@nestjs/common';

export const getMimeType = (url: string): string => {
  const supportImageTypes = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'svg',
    'tiff',
  ];

  const mimeType = url.match(/\.(\w+)$/)[1];
  if (!supportImageTypes.includes(mimeType)) {
    throw new InternalServerErrorException('지원하지 않는 이미지 형식입니다.');
  }

  return mimeType;
};
