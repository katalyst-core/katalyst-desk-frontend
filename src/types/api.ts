import type { PaginationData } from "./table";

export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  message: string;
  data: T;
  error: ApiError | null;
}

export type ApiError = {
  code: string;
}

export type ApiTableOptions<T> = {
  table: T,
  pagination: PaginationData
}