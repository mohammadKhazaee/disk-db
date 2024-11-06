import { Number_ } from './number.type';

export interface PaginationData {
  skip: Number_.Integer.Whole;
  limit: Number_.Integer.Natural;
}
