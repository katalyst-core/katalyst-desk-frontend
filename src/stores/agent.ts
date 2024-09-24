import type { AgentObject } from "$types/agent";
import { writable, type Writable } from "svelte/store";

export const agent: Writable<AgentObject | null> = writable(null);