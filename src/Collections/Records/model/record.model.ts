import { CollectionNameState } from 'src/Collections/types/colection-name.type';
import { String_ } from 'src/Common/types/string.type';

export type RecordId = String_.UUID_;

export type Record = object & {
  id: RecordId;
};

export namespace Record {
  export type CheckRecordState =
    | CheckRecordState.Existed
    | CheckRecordState.NonExisted;

  export namespace CheckRecordState {
    export interface Existed {
      _tag: 'Existed';
      collectionName: CollectionNameState.Existed;
      recordId: RecordId;
    }

    export interface NonExisted {
      _tag: 'NonExisted';
      collectionName: CollectionNameState.Existed;
      recordId: RecordId;
    }
  }
}
