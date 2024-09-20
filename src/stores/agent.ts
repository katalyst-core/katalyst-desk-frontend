import type { UserObject } from "$types/user";
import { writable, type Writable } from "svelte/store";

export const agent: Writable<UserObject | null> = writable(null);