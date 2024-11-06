import { Record } from '../Records/model/record.model';
import { VerifiedCollectionName } from '../types/colection-name.type';

export interface Collection {
  name: VerifiedCollectionName;
  records: Record[];
}

export namespace Collection {
  export interface CreationConfirm {
    message: 'Collection created successfully';
    collectionName: VerifiedCollectionName;
  }

  export interface DeletionConfirm {
    message: 'Collection deleted successfully';
    collectionName: VerifiedCollectionName;
  }
}
