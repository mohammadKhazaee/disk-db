import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CollectionRepository } from './collections.repository';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionRepository],
  exports: [CollectionRepository, CollectionsService],
})
export class CollectionsModule {}
