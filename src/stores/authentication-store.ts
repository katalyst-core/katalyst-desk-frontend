import { persisted } from "svelte-persisted-store";

export const persistedAccessToken = persisted('katalyst-desk.access-token', '');