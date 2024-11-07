import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { DataConverter } from '../DataConverter/DataConverter.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileStorage<T> {
  private FILE_EXENSION: string;
  private readonly dirPath: string;
  private readonly MAX_RECORD_PER_FILE = 100;

  constructor(
    private readonly converter: DataConverter<T>,
    private configService: ConfigService,
  ) {
    console.log('Connected to SDD.');

    this.dirPath = path.join(
      path.dirname(require.main.filename),
      '..',
      'src',
      'Common',
      'data',
      configService.get('NODE_ENV') === 'test'
        ? 'test_collection_files'
        : 'collection_files',
    );

    this.FILE_EXENSION = this.configService.get('SDD_STORE_TYPE');
  }

  async write(filename: string, data: T[]): Promise<void> {
    await fs.promises.writeFile(
      path.join(this.dirPath, `${filename}.${this.FILE_EXENSION}`),
      this.converter.stringify(data),
    );
  }

  async read(filename: string): Promise<T[]> {
    const rawRecords = await fs.promises.readFile(
      path.join(this.dirPath, `${filename}.${this.FILE_EXENSION}`),
      'utf-8',
    );
    return this.converter.parse(rawRecords);
  }

  async delete(filename: string): Promise<void> {
    await fs.promises.unlink(
      path.join(this.dirPath, `${filename}.${this.FILE_EXENSION}`),
    );
  }

  async exists(filename: string): Promise<void> {
    await fs.promises.access(
      path.join(this.dirPath, `${filename}.${this.FILE_EXENSION}`),
    );
  }
}
