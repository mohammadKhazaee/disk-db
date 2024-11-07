import { IsNotEmptyObject } from 'class-validator';
import { NonEmptyObject } from '../../../Common/types/object.type';

export class NonEmptyObjectDto {
  @IsNotEmptyObject()
  data: NonEmptyObject;
}
