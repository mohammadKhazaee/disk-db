import { Branded } from 'src/Common/types/brand';

export type ValidCollectionName = Branded<string, 'ValidCollectionName'>;

export namespace ValidCollectionName {
  export const is = (x: string): x is ValidCollectionName =>
    x.length >= 3 && x.length <= 20;
}

export type VerifiedCollectionName = Branded<
  ValidCollectionName,
  'VerifiedCollectionName'
>;

export type CollectionNameState =
  | CollectionNameState.Existed
  | CollectionNameState.NonExisted;

export namespace CollectionNameState {
  export interface Existed {
    _tag: 'Existed';
    value: VerifiedCollectionName;
  }

  export interface NonExisted {
    _tag: 'NonExisted';
    value: ValidCollectionName;
  }
}
