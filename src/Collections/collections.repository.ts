import * as fs from 'fs';
import * as path from 'path';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ICollectionRepository } from './interface/ICollection.repository';
import { Number_ } from 'src/Common/types/number.type';
import { Collection } from './model/collection.model';
import { Record, RecordId } from './Records/model/record.model';
import {
  CollectionNameState,
  ValidCollectionName,
  VerifiedCollectionName,
} from './types/colection-name.type';
import { NonEmptyObject } from 'src/Common/types/object.type';
import { FileStorage } from 'src/common/FileStorage/FileStorage';

@Injectable()
export class CollectionRepository implements ICollectionRepository {
  private readonly FILE_EXENSION = process.env.SDD_STORE_TYPE ?? 'json';
  private readonly MAX_RECORD_PER_FILE = 100;
  private readonly dirPath: string;

  constructor(private readonly fileStorage: FileStorage<Record>) {
    console.log('Connected to SDD.');

    this.dirPath = path.join(
      path.dirname(require.main.filename),
      '..',
      'src',
      'Common',
      'data',
      'collection_files',
    );
  }

  async verifyCollectionName(
    name: ValidCollectionName,
  ): Promise<CollectionNameState> {
    try {
      await this.fileStorage.exists(name);

      return {
        _tag: 'Existed',
        value: name as VerifiedCollectionName,
      };
    } catch (error) {
      return {
        _tag: 'NonExisted',
        value: name as ValidCollectionName,
      };
    }
  }

  async createCollection(
    name: CollectionNameState.NonExisted,
  ): Promise<Collection.CreationConfirm> {
    await this.fileStorage.write(name.value, []);

    return {
      message: 'Collection created successfully',
      collectionName: name.value as VerifiedCollectionName,
    };
  }

  async deleteCollection(
    name: CollectionNameState.Existed,
  ): Promise<Collection.DeletionConfirm> {
    await this.fileStorage.delete(name.value);

    return {
      message: 'Collection deleted successfully',
      collectionName: name.value,
    };
  }

  async createRecord({
    collectionName,
    record,
  }: {
    collectionName: CollectionNameState.Existed;
    record: Record;
  }): Promise<Record> {
    const records = await this.fetchRecords({ collectionName });
    const appendedRecords = records.concat(record);

    await this.fileStorage.write(collectionName.value, appendedRecords);

    return record;
  }

  async updateRecord({
    recordLocator,
    changedFields,
  }: {
    recordLocator: Record.CheckRecordState.Existed;
    changedFields: NonEmptyObject;
  }): Promise<Record> {
    const records = await this.fetchRecords({
      collectionName: recordLocator.collectionName,
    });
    const targedRecordIndex = records.findIndex(
      (r) => r.id === recordLocator.recordId,
    );

    if (targedRecordIndex === -1)
      throw new InternalServerErrorException('not found record id');

    const updatedRecord = {
      ...records[targedRecordIndex],
      ...changedFields,
    };
    /**
     * Could've use another approach to not mutate the array
     * but decided to mutate it for better performance
     */
    records[targedRecordIndex] = {
      ...records[targedRecordIndex],
      ...changedFields,
    };

    await this.fileStorage.write(recordLocator.collectionName.value, records);

    return updatedRecord;
  }

  async deleteRecord(
    recordLocator: Record.CheckRecordState.Existed,
  ): Promise<[Record.CheckRecordState.NonExisted, Record]> {
    const records = await this.fetchRecords({
      collectionName: recordLocator.collectionName,
    });
    const targedRecordIndex = records.findIndex(
      (r) => r.id === recordLocator.recordId,
    );

    if (targedRecordIndex === -1)
      throw new InternalServerErrorException('not found record id');

    const updatedRecords = [
      ...records.slice(0, targedRecordIndex),
      ...records.slice(targedRecordIndex + 1),
    ];

    await this.fileStorage.write(
      recordLocator.collectionName.value,
      updatedRecords,
    );

    return [
      {
        _tag: 'NonExisted',
        collectionName: recordLocator.collectionName,
        recordId: recordLocator.recordId,
      },
      records[targedRecordIndex],
    ];
  }

  async fetchRecord({
    collectionName,
    recordId,
  }: {
    collectionName: CollectionNameState.Existed;
    recordId: RecordId;
  }): Promise<Record | Record.CheckRecordState.NonExisted> {
    const records = await this.fetchRecords({ collectionName });
    const targedRecord = records.find((r) => r.id === recordId);

    if (!targedRecord)
      return {
        _tag: 'NonExisted',
        collectionName,
        recordId,
      };

    return targedRecord;
  }

  async fetchRecords({
    collectionName,
    limit = Infinity as Number_.Integer.Natural,
    skip = 0 as Number_.Integer.Whole,
  }: {
    collectionName: CollectionNameState.Existed;
    limit?: Number_.Integer.Natural;
    skip?: Number_.Integer.Whole;
  }): Promise<Record[]> {
    const records = await this.fileStorage.read(collectionName.value);

    return records.slice(skip, limit);
  }

  async doesRecordExist({
    collectionName,
    recordId,
  }: {
    collectionName: CollectionNameState.Existed;
    recordId: RecordId;
  }): Promise<Record.CheckRecordState> {
    const targetedRecord = await this.fetchRecord({ collectionName, recordId });

    if ('_tag' in targetedRecord) return targetedRecord;

    return {
      _tag: 'Existed',
      collectionName,
      recordId,
    };
  }
}
