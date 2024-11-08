import type { Component } from "lucide-svelte";

export type SidebarObject = {
  label: string;
  icon: typeof Component;
  path: string;
  open?: boolean;
  children?: SidebarChildObject[];
}

export type SidebarChildObject = {
  label: string;
  path: string;
}