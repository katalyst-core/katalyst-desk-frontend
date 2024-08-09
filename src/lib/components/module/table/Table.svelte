<script lang="ts">
	import {
		Column,
		createTable,
		Render,
		Subscribe,
		type Table as TableType
	} from 'svelte-headless-table';
	import {
		addPagination,
		addSelectedRows,
		addSortBy,
		type AnyPlugins,
		type PluginStates
	} from 'svelte-headless-table/plugins';
	import { keyed } from 'svelte-keyed';
	import type { Writable } from 'svelte/store';

	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import * as Table from '$ui/table';
	import * as Pagination from '$ui/pagination';

	import type { PaginationData, TableData } from '$types/table';

	export let data: TableData<unknown>;
	export let colBuilder: (table: TableType<never, any>) => Column<never, any>[];
	export let loading: boolean = false;
	export let tableStates: PluginStates<AnyPlugins> | null = null;

	const { table: tableData, pagination } = data;
	const totalItem = keyed(pagination, 'total_item');
	const table = createTable(tableData as Writable<never[]>, {
		sort: addSortBy({
			toggleOrder: ['asc', 'desc'],
			serverSide: true
		}),
		select: addSelectedRows(),
		page: addPagination({
			serverSide: true,
			serverItemCount: totalItem
		})
	});

	const columns = colBuilder(table);
	const tableView = table.createViewModel(columns);
	const { tableAttrs, headerRows, tableBodyAttrs, pageRows, pluginStates } = tableView;
	const { pageIndex, pageSize } = pluginStates.page;

	tableStates = pluginStates;

	pagination.subscribe((paginate: PaginationData) => {
		$pageSize = paginate.per_page;
		$pageIndex = paginate.current_page;
	});
</script>

<div class="space-y-2">
	<div class="border rounded-md">
		<Table.Root {...$tableAttrs}>
			<Table.Header class="h-12">
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Head {...attrs} class="{cell.id === 'action' ? 'text-right' : ''} {cell.id === 'select' ? 'w-12' : ''} px-4">
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>

			<Table.Body {...$tableBodyAttrs}>
				{#if !loading}
					{#if $pageRows.length}
						{#each $pageRows as row (row.id)}
							<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
								<Table.Row {...rowAttrs} class="h-12">
									{#each row.cells as cell (cell.id)}
										<Subscribe attrs={cell.attrs()} let:attrs>
											<Table.Cell {...attrs} class="{cell.id === 'action' ? 'text-right' : ''} {cell.id === 'select' ? 'w-12' : ''} px-4">
												<Render of={cell.render()} />
											</Table.Cell>
										</Subscribe>
									{/each}
								</Table.Row>
							</Subscribe>
						{/each}
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="text-center">No results</Table.Cell>
						</Table.Row>
					{/if}
				{:else}
					<Table.Row>
						<Table.Cell colspan={columns.length} class="text-center">Loading...</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>

	<Pagination.Root
		count={Math.max(1, $totalItem)}
		perPage={$pageSize}
		page={$pageIndex}
		onPageChange={(page) => ($pageIndex = page)}
		let:pages
		let:currentPage
		class="items-end"
	>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton class="flex justify-center items-center px-3">
					<ChevronLeft class="w-4 h-4" />
				</Pagination.PrevButton>
			</Pagination.Item>

			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={page.value === currentPage}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}

			<Pagination.Item>
				<Pagination.NextButton class="flex justify-center items-center px-3">
					<ChevronRight class="w-4 h-4" />
				</Pagination.NextButton>
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>
</div>
