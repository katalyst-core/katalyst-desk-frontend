import type { PaginationData } from "./table-type";

export type ApiResponse<T = undefined> = {
  ok: boolean;
  status: number;
  message: string;
  data: T;
  error: ApiError | null;
}

export type ApiError = {
  code: string;
}

export type TableOptions<T> = {
  result: T,
  pagination: PaginationData
}