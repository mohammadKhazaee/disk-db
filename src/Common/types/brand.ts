export declare const BRAND: unique symbol;
export declare type BRAND<T extends string | number | symbol> = {
  [BRAND]: {
    [k in T]: true;
  };
};

export type Branded<A, B extends string> = A & BRAND<B>;
