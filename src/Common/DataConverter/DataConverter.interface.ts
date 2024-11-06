export interface DataConverter<T> {
  stringify(data: T[]): string;

  parse(data: string): T[];
}
