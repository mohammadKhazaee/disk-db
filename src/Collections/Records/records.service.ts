import { v4 } from 'uuid';

import { Injectable, NotFoundException } from '@nestjs/common';
import { CollectionRepository } from '../collections.repository';
import {
  CollectionNameState,
  ValidCollectionName,
} from '../types/colection-name.type';
import { NonEmptyObject } from 'src/Common/types/object.type';
import { PaginationData } from 'src/Common/types/pagination.type';
import { FindRecordDto } from '../dto/find-record.dto';
import { CollectionsService } from '../collections.service';
import { Record, RecordId } from './model/record.model';

@Injectable()
export class RecordsService {
  constructor(
    private readonly collectionsSevice: CollectionsService,
    private readonly collectionRepo: CollectionRepository,
  ) {}

  async getRecords(
    collectionName: ValidCollectionName,
    paginationDto: PaginationData,
  ) {
    const nameStatus =
      await this.collectionsSevice.verifyCollectionExists(collectionName);

    return this.collectionRepo.fetchRecords({
      collectionName: nameStatus,
      ...paginationDto,
    });
  }

  async getRecord({ collectionName, recordId }: FindRecordDto) {
    const nameStatus =
      await this.collectionsSevice.verifyCollectionExists(collectionName);

    return this.collectionRepo.fetchRecord({
      collectionName: nameStatus,
      recordId,
    });
  }

  async createRecord(
    collectionName: ValidCollectionName,
    data: NonEmptyObject,
  ) {
    const nameStatus =
      await this.collectionsSevice.verifyCollectionExists(collectionName);

    const record: Record = { id: v4(), ...data };

    return this.collectionRepo.createRecord({
      collectionName: nameStatus,
      record,
    });
  }

  async updateRecord(
    { collectionName, recordId }: FindRecordDto,
    data: NonEmptyObject,
  ) {
    const nameStatus =
      await this.collectionsSevice.verifyCollectionExists(collectionName);

    const recordExistance = await this.doesRecordExist({
      collectionName: nameStatus,
      recordId,
    });

    const record: Record = { id: v4(), ...data };

    return this.collectionRepo.updateRecord({
      changedFields: data,
      recordLocator: recordExistance,
    });
  }

  async deleteRecord({ collectionName, recordId }: FindRecordDto) {
    const nameStatus =
      await this.collectionsSevice.verifyCollectionExists(collectionName);

    const recordExistance = await this.doesRecordExist({
      collectionName: nameStatus,
      recordId,
    });

    const deleteRecord = (
      await this.collectionRepo.deleteRecord(recordExistance)
    )[1];

    return { message: 'record deleted.', record: deleteRecord };
  }

  async doesRecordExist(spec: {
    collectionName: CollectionNameState.Existed;
    recordId: RecordId;
  }) {
    const recordExistance = await this.collectionRepo.doesRecordExist(spec);

    if (recordExistance._tag === 'NonExisted')
      throw new NotFoundException("this record doesn't exists");

    return recordExistance;
  }
}
