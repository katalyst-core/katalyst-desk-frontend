import type { Component } from 'lucide-svelte';
import type { Writable } from 'svelte/store';

export type TableData<T> = {
	table: Writable<T[]>;
	pagination: Writable<PaginationData>;
};

export type PaginationData = {
	current_page: number;
	per_page: number;
	total_item: number;
	total_page: number;
};

export type TableActionOption<T> = {
  label: string;
  icon?: typeof Component;
  href?: string;
  action?: (props: T) => void
};

export type TableQueryOption = {
	page?: number;
	limit?: number;
	sort?: {
		name: string;
		direction: 'asc' | 'desc';
	}
};