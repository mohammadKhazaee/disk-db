import { PickType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './create-collection.dto';
import { IsUUID } from 'class-validator';
import { RecordId } from '../Records/model/record.model';

export class FindRecordDto extends PickType(CreateCollectionDto, [
  'collectionName',
] as const) {
  @IsUUID('4')
  recordId: RecordId;
}
