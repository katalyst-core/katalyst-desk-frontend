import type { StoreObject } from "$types/store";

import { fetchApi } from "$lib/custom-fetch";
import { currentStore, stores } from "$stores/store";
import toast from "svelte-french-toast";

export const fetchStores = async (currentStoreId?: string) => {
  stores.set(null);

  const response = await fetchApi('/store/list');

  if (!response.ok) {
    toast.error('Unable to retrieve stores');
    return;
  }

  const result = await response.json();
  const data = result.data as StoreObject[];

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