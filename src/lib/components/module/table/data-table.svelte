<script lang="ts" generics="T">
	import {
		getCoreRowModel,
		getSortedRowModel,
		type ColumnDef,
		type SortingState
	} from '@tanstack/table-core';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	import * as Table from '$ui/table';
	import * as Pagination from '$ui/pagination';
	import { createSvelteTable, FlexRender } from '$ui/data-table';
	import { TableSortHeader } from '$module/table';
	import type { TableQueryOption } from '$types/table-type';

	interface Props<T> {
		columns: ColumnDef<T>[];
		data: T[];
		pageLimit?: number;
		itemCount?: number;
		pagination: boolean;
		sorting: boolean;
    isLoading?: boolean;
		onChange?: (options: TableQueryOption) => void;
	}

	let {
		data,
		columns,
		pageLimit,
		itemCount,
		pagination = false,
		sorting = false,
    isLoading = false,
		onChange
	}: Props<T> = $props();

	let sortingState: SortingState = $state([]);
	let pageIndex: number = $state(1);

	$effect(() => {
		if (!onChange) return;

		onChange({
			...(pageLimit && { limit: pageLimit }),
			page: pageIndex,
			...(sortingState.length > 0 && {
				sort: {
					name: sortingState[0].id,
					direction: sortingState[0].desc ? 'desc' : 'asc'
				}
			})
		});
	});

	const table = createSvelteTable({
		get data() {
			return data || [];
		},
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (updater instanceof Function) {
				sortingState = updater(sortingState);
			} else {
				sortingState = updater;
			}
		},
		state: {
			get sorting() {
				return sortingState;
			}
		}
	});
</script>

<div class="w-full h-full flex flex-col items-end space-y-2">
	<div class="border rounded-md">
		<Table.Root class="table-fixed">
			<Table.Header class="h-12">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							{@const headerSize = header.getSize()}
							<Table.Head style="width: {headerSize || 'auto'}px;" class="px-4">
								{#if sorting}
									<TableSortHeader
										toggle={header.column.getToggleSortingHandler()}
										order={sortingState.length > 0 && sortingState[0].id === header.column.id
											? sortingState[0].desc
												? 'desc'
												: 'asc'
											: undefined}
									>
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									</TableSortHeader>
								{:else}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#if !isLoading}
					{#if data.length > 0}
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row data-state={row.getIsSelected() && 'selected'} class="h-12">
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell class="px-4">
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center font-medium"
								>No results</Table.Cell
							>
						</Table.Row>
					{/if}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="h-24 text-center font-medium"
							>Loading...</Table.Cell
						>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	{#if pagination}
		<Pagination.Root
			count={Math.max(1, itemCount || 0)}
			perPage={pageLimit}
			siblingCount={1}
			onPageChange={(page) => (pageIndex = page)}
			class="items-end"
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton>
							<ChevronLeft class="size-4" />
							<span class="hidden sm:block">Previous</span>
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton>
							<span class="hidden sm:block">Next</span>
							<ChevronRight class="size-4" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/if}
</div>
