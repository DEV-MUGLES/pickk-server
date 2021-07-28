import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient } from 'nest-sens';

@Injectable()
export class AlimtalkService {
  constructor(
    @Inject(AlimtalkClient) private readonly alimtalkClient: AlimtalkClient
  ) {}
}
