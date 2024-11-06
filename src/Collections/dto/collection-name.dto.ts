import { PickType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './create-collection.dto';

export class CollectionNameDto extends PickType(CreateCollectionDto, [
  'collectionName',
] as const) {}
