import type { Component } from "lucide-svelte";

export type SItems = SItem[];

export type SItem = {
  label: string;
  icon: typeof Component;
  path: string;
  open?: boolean;
  children?: SChildItem[];
}

export type SChildItem = {
  label: string;
  path: string;
}