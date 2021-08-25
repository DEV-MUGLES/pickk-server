import { ObjectType } from '@nestjs/graphql';

import { InquiryEntity } from '../entities';

@ObjectType()
export class Inquiry extends InquiryEntity {}
