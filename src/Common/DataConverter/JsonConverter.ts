import { Injectable } from '@nestjs/common';
import { DataConverter } from './DataConverter.interface';

@Injectable()
export class JsonConverter<T> implements DataConverter<T> {
  stringify(data: T[]): string {
    return JSON.stringify(data, null, 0);
  }

  parse(data: string): T[] {
    return JSON.parse(data) as T[];
  }
}
