import { Record, RecordId } from '../Records/model/record.model';
import { Number_ } from 'src/Common/types/number.type';
import {
  CollectionNameState,
  ValidCollectionName,
} from '../types/colection-name.type';
import { Collection } from '../model/collection.model';
import { NonEmptyObject } from 'src/Common/types/object.type';

export interface ICollectionRepository {
  verifyCollectionName(name: ValidCollectionName): Promise<CollectionNameState>;

  createCollection(
    name: CollectionNameState.NonExisted,
  ): Promise<Collection.CreationConfirm>;

  deleteCollection(
    name: CollectionNameState.Existed,
  ): Promise<Collection.DeletionConfirm>;

  createRecord(spec: {
    collectionName: CollectionNameState.Existed;
    record: Record;
  }): Promise<Record>;

  updateRecord(spec: {
    recordLocator: Record.CheckRecordState.Existed;
    changedFields: NonEmptyObject;
  }): Promise<Record>;

  deleteRecord(
    recordLocator: Record.CheckRecordState.Existed,
  ): Promise<[Record.CheckRecordState.NonExisted, Record]>;

  doesRecordExist(spec: {
    collectionName: CollectionNameState.Existed;
    recordId: RecordId;
  }): Promise<Record.CheckRecordState>;

  fetchRecord({
    collectionName,
    recordId,
  }: {
    collectionName: CollectionNameState.Existed;
    recordId: RecordId;
  }): Promise<Record | Record.CheckRecordState.NonExisted>;

  fetchRecords(spec: {
    collectionName: CollectionNameState.Existed;
    limit: Number_.Integer.Natural;
    skip: Number_.Integer.Whole;
  }): Promise<Record[]>;
}
