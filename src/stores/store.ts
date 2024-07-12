import type { StoreObject } from "$lib/types";
import { writable, type Writable } from "svelte/store";

export const stores: Writable<StoreObject[] | null> = writable(null);
export const activeStore: Writable<string | null> = writable(null);