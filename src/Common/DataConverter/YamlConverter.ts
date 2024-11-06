import * as yaml from 'js-yaml';

import { Injectable } from '@nestjs/common';
import { DataConverter } from './DataConverter.interface';

@Injectable()
export class YamlConverter<T> implements DataConverter<T> {
  stringify(data: T[]): string {
    return yaml.dump(data);
  }

  parse(data: string): T[] {
    return yaml.load(data) as T[];
  }
}
