export type PaginatedResults<T> = {
  registers: number;
  lastPage: number;
  data: T[];
};
