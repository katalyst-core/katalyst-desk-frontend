import toast from "svelte-french-toast";

import type { StoreObject } from "$types/store";
import type { ApiResponse } from "$types/api";
import { fetchApi } from "$lib/custom-fetch";
import { currentStore, stores } from "$stores/store";

export const fetchStores = async (currentStoreId?: string) => {
  stores.set(null);

  const response: ApiResponse<StoreObject[]> | null = await fetchApi('/store/list');

  if (!response) {
    return;
  }

  if (!response.ok) {
    toast.error('Unable to retrieve stores');
    return;
  }

  const data = response.data;
  stores.set(data);

  currentStore.update((store) => {
    if (data.length === 0) {
      return null;
    }

    if (store == null) {
      return data[0].id;
    }

    if (currentStoreId) {
      store = currentStoreId;
    }

    if (!data.find((d: StoreObject) => d.id == store)) {
      return data[0].id;
    }

    return store;
  })
};