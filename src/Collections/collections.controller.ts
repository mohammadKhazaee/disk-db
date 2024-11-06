import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './Dto/create-collection.dto';
import { CollectionNameDto } from './dto/collection-name.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionService: CollectionsService) {}

  @Post()
  @HttpCode(201)
  postCollection(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<any> {
    return this.collectionService.createCollection(
      createCollectionDto.collectionName,
    );
  }

  @Delete('/:collectionName')
  @HttpCode(200)
  deleteCollection(@Param() { collectionName }: CollectionNameDto): any {
    return this.collectionService.deleteCollection(collectionName);
  }
}
