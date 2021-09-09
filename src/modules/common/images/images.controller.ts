import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { RestVerifyGuard } from '@auth/guards';

import { ImagesService } from './images.service';

@Controller('/images')
@UseGuards(RestVerifyGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @UploadedFiles() files: Array<Express.Multer.File>
  ): Promise<string[]> {
    const results = await this.imagesService.uploadBufferDatas(
      files.map((file) => ({
        filename: file.originalname,
        buffer: file.buffer,
        mimetype: file.mimetype,
      }))
    );

    return results.map((result) => result.url);
  }
}
