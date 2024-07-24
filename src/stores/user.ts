import type { UserObject } from "$types/user";
import { writable, type Writable } from "svelte/store";

export const user: Writable<UserObject | null> = writable(null);