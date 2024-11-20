import { writable, type Writable } from "svelte/store";
import { Socket } from 'socket.io-client';

export const socket: Writable<Socket | null> = writable(null);
export const isSockedConnected: Writable<boolean> = writable(false);