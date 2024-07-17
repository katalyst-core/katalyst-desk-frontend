import type { StoreObject } from '$types/store';
import { writable, type Writable } from "svelte/store";

export const stores: Writable<StoreObject[] | null> = writable(null);
export const currentStore: Writable<string | null> = writable(null);