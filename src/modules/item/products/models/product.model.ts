import { ObjectType } from '@nestjs/graphql';
import { ProductEntity } from '../entities/product.entity';

@ObjectType()
export class Product extends ProductEntity {}
