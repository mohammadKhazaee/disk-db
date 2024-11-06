import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CollectionNameDto } from '../dto/collection-name.dto';
import { FindRecordDto } from '../dto/find-record.dto';
import { PaginationQueryTranformer } from 'src/Common/pipes/pagination-query.pipe';
import { Number_ } from 'src/Common/types/number.type';
import { RecordsService } from './records.service';
import { NonEmptyObjectDto } from './dto/non-empty-object.dto';

@Controller('collections/:collectionName/records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  @HttpCode(200)
  getRecords(
    @Param() { collectionName }: CollectionNameDto,
    @Query('skip', PaginationQueryTranformer) skip: Number_.Integer.Whole,
    @Query('limit', PaginationQueryTranformer) limit: Number_.Integer.Natural,
  ) {
    return this.recordsService.getRecords(collectionName, { skip, limit });
  }

  @Get('/:recordId')
  @HttpCode(200)
  getRecord(@Param() spec: FindRecordDto) {
    return this.recordsService.getRecord(spec);
  }

  @Post()
  @HttpCode(201)
  postRecord(
    @Param() { collectionName }: CollectionNameDto,
    @Body() { data: createRecordObject }: NonEmptyObjectDto,
  ) {
    return this.recordsService.createRecord(collectionName, createRecordObject);
  }

  @Put('/:recordId')
  @HttpCode(200)
  putRecord(
    @Param() spec: FindRecordDto,
    @Body() { data: updateRecordObject }: NonEmptyObjectDto,
  ) {
    return this.recordsService.updateRecord(spec, updateRecordObject);
  }

  @Delete('/:recordId')
  @HttpCode(200)
  deleteRecord(@Param() spec: FindRecordDto) {
    return this.recordsService.deleteRecord(spec);
  }
}
