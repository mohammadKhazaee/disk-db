import { Branded } from './brand';

export namespace Number_ {
  export type Integer = Branded<number, 'Integer'>;

  export namespace Integer {
    export const is = (x: unknown): x is Integer => Number.isInteger(x);

    export type Whole = Branded<Integer, 'Whole'>;
    export namespace Whole {
      export const is = (x: unknown): x is Whole => {
        return Number.isInteger(x) && typeof x === 'number' && x >= 0;
      };
    }

    export type Natural = Branded<Integer, 'Natural'>;
    export namespace Natural {
      export const is = (x: unknown): x is Whole =>
        Number.isInteger(x) && typeof x === 'number' && x > 0;
    }
  }
}
