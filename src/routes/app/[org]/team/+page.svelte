<script lang="ts">
	import * as Table from '$ui/table';
	import { createSvelteTable, FlexRender, renderComponent } from '$ui/data-table';
	import {
		getCoreRowModel,
		getSortedRowModel,
		type ColumnDef,
		type SortingState
	} from '@tanstack/table-core';
	import { TableAction } from '$module/page/team';
	import TableSortHeader from '$module/table/TableSortHeader.svelte';
	import { TicketAPI } from '$api/index';
	import type { TicketMessage } from '$types/message-type';
	import { onMount } from 'svelte';

	let isLoading = $state(true);
	let sortingState: SortingState = $state([]);
	let data: TicketMessage[] = $state([]);

	const fetchData = async () => {
		isLoading = true;

		const response = await TicketAPI.getMessagesByTicketIdTest('oqkXzqWHDW3sivi5xfzRyM', {
			limit: 5,
			...(sortingState.length > 0 && {
				sort: {
					name: sortingState[0].id,
					direction: sortingState[0].desc ? 'desc' : 'asc'
				}
			})
		});

		if (!response || !response.ok) return;

		data = response.data.result;

		isLoading = false;
	};

	const columnDefs: ColumnDef<any>[] = [
		{
			id: 'message_id',
			accessorKey: 'message_id',
			header: 'ID'
		},
		{
			accessorKey: 'content.body',
			header: 'Body',
			enableSorting: false,
		},
		{
			id: 'createdAt',
			accessorKey: 'timestamp',
			header: 'Created Date',
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => {
				return renderComponent(TableAction, { id: row.original.id });
			}
		}
	];

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns: columnDefs,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (updater instanceof Function) {
				sortingState = updater(sortingState);
			} else {
				sortingState = updater;
			}

			fetchData();
		},
		state: {
			get sorting() {
				return sortingState;
			}
		}
	});

	onMount(() => {
		fetchData();
	});
</script>

<div class="w-full h-full">
	<div class="border rounded-md p-8">
		<Table.Root class="table-fixed">
			<Table.Header class="h-12">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							{@const headerSize = header.getSize()}
							<!-- {...attrs}
								class="{cell.id === 'action' ? 'text-right' : ''} {cell.id === 'select'
									? 'w-12'
									: ''} px-4" -->
							<Table.Head style="width: {headerSize || 'auto'}px;">
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
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>

			<Table.Body>
				{#if !isLoading}
					{#if data.length > 0}
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row data-state={row.getIsSelected() && "selected"} class="h-12">
								{#each row.getVisibleCells() as cell (cell.id)}
									<!-- class="{cell.id === 'action' ? 'text-right' : ''} {cell.id === 'select'
											? 'w-12'
											: ''} px-4" -->
									<Table.Cell>
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={columnDefs.length} class="h-24 text-center font-medium"
								>No results</Table.Cell
							>
						</Table.Row>
					{/if}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columnDefs.length} class="h-24 text-center font-medium"
							>Loading...</Table.Cell
						>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
