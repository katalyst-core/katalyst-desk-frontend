import type { AnyPlugins, PaginationState, PluginStates, SortByState } from "svelte-headless-table/plugins";
import { get, writable, type Writable } from "svelte/store";

export const subscribePlugins = (pluginStates: PluginStates<AnyPlugins> | null, run: () => void | Promise<void>) => {
  if (!pluginStates) {
    return;
  }

  const sort: SortByState<unknown> | null = pluginStates.sort;
  if (sort) {
    sort.sortKeys.subscribe(() => run())
  }

  const page: PaginationState | null = pluginStates.page;
  if (page) {
    page.pageIndex.subscribe(() => run())
  }
};

export const getTableOptions = (pluginStates: PluginStates<AnyPlugins> | null): URLSearchParams => {
  const query = new URLSearchParams();

  if (!pluginStates) {
    return query;
  }

  // Handle sorting
  const sort: SortByState<unknown> | null = pluginStates.sort;
  if (sort) {
    const sortKeys = get(sort.sortKeys);

    if (sortKeys.length > 0) {
      const sortQuery = sortKeys
        .map((sortKey) => {
          const key = sortKey.id;
          const value = sortKey.order;

          return `${key}:${value}`;
        })
        .join(',');

      query.set('sort', sortQuery);
    }

  }

  // Handle pagination
  const page: PaginationState | null = pluginStates.page;
  if (page) {
    const pageIndex = get(page.pageIndex);

    if (pageIndex > 0) {
      query.set('page', pageIndex.toString());
    }
  }

  return query;
};

export type TableData = {
  table: Writable<never[]>;
  pagination: Writable<PaginationData>;
}

export type PaginationData = {
  current_page: number;
  per_page: number;
  total_item: number;
  total_page: number;
};

export const initTableData = () => ({
  table: writable([]),
  pagination: writable(
    {
      current_page: 1,
      per_page: 10,
      total_item: 0,
      total_page: 1
    }
  )
});