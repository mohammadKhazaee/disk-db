import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Number_ } from '../types/number.type';

@Injectable()
export class PaginationQueryTranformer implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'query') return value;

    if (metadata.data === 'skip')
      return Number_.Integer.Whole.is(+value) ? +value : 0;

    if (metadata.data === 'limit')
      return Number_.Integer.Natural.is(+value) ? +value : 10;

    return value;
  }
}
