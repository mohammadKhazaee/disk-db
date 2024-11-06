import { Module } from '@nestjs/common';
import { FileStorage } from './FileStorage/FileStorage';
import { Record } from 'src/Collections/Records/model/record.model';
import { DataConverter } from './DataConverter/DataConverter.interface';
import { JsonConverter } from './DataConverter/JsonConverter';
import { YamlConverter } from './DataConverter/YamlConverter';
import { ConfigService } from '@nestjs/config';
import { BinaryConverter } from './DataConverter/BinaryConverter';

@Module({
  providers: [
    {
      provide: FileStorage,
      useFactory: (configService: ConfigService): FileStorage<Record> => {
        const fileType = configService.get('SDD_STORE_TYPE');

        let converter: DataConverter<Record>;

        switch (fileType) {
          case 'json':
            converter = new JsonConverter();
            break;
          case 'yaml':
            converter = new YamlConverter();
            break;
          case 'bin':
            converter = new BinaryConverter(new YamlConverter());
            break;
          default:
            throw new Error('file type is not supported');
        }

        return new FileStorage(converter, configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [FileStorage],
})
export class CommonModule {}
