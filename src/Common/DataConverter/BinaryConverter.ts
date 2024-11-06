import { Injectable } from '@nestjs/common';
import { DataConverter } from './DataConverter.interface';

@Injectable()
export class BinaryConverter<T> implements DataConverter<T> {
  constructor(private readonly converter: DataConverter<T>) {}

  stringify(data: T[]): string {
    return Buffer.from(this.converter.stringify(data)).toString('hex');
  }

  parse(data: string): T[] {
    const convertedHexStr = Buffer.from(data, 'hex').toString();
    return this.converter.parse(convertedHexStr);
  }
}
