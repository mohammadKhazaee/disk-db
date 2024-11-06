import 'uuid';
import { String_ } from './string.type';

declare module 'uuid' {
  export function v4(): String_.UUID_;
}
