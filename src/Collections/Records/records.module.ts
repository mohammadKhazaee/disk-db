import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { CollectionsModule } from '../collections.module';

@Module({
  imports: [CollectionsModule],
  providers: [RecordsService],
  controllers: [RecordsController],
})
export class RecordsModule {}
