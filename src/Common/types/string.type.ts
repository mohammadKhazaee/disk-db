import { Branded } from './brand';

const UUID_REGEX =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export namespace String_ {
  export type UUID_ = Branded<string, 'UUID'>;

  export const is = (x: string): x is UUID_ => UUID_REGEX.test(x);
}
