import { ObjectType } from '@nestjs/graphql';
import { DigestsExhibitionDigestEntity } from '../entities/digests-exhibition-digest.entity';

@ObjectType()
export class DigestsExhibitionDigest extends DigestsExhibitionDigestEntity {}
