import { IsString, Length } from 'class-validator';
import { ValidCollectionName } from '../types/colection-name.type';

export class CreateCollectionDto {
  @IsString()
  @Length(3, 20)
  collectionName: ValidCollectionName;
}
