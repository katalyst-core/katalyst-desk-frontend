import type { AgentInfoResponse } from "$types/agent-type";
import { writable, type Writable } from "svelte/store";

export const agent: Writable<AgentInfoResponse | null> = writable(null);