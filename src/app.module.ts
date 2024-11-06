import { Module } from '@nestjs/common';
import { RecordsModule } from './Collections/Records/records.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RecordsModule,
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
