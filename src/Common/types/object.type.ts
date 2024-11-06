import { Branded } from './brand';

export type NonEmptyObject = Branded<object, 'NonEmptyObject'>;

export namespace NonEmptyObject {
  export const is = (obj: object): obj is NonEmptyObject =>
    Object.keys(obj).length > 0;
}
