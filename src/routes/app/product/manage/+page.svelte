<script lang="ts">
	import { onMount } from 'svelte';
	import { type Table as TableType } from 'svelte-headless-table';
	import { type AnyPlugins, type PluginStates } from 'svelte-headless-table/plugins';
	import toast from 'svelte-french-toast';

	import { CirclePlus } from 'lucide-svelte';
	import { Button } from '$ui/button';
	import { ActionCell, SortHeader } from '$module/table';
	import { CheckboxCell, CheckboxHeader, Table as Table } from '$module/table';
	import { ProductListDropdown } from '$module/table/dropdown';

	import { fetchApi } from '$lib/custom-fetch';
	import { currentStore } from '$stores/store';
	import type { DeleteProductList, ProductListObject } from '$types/product';
	import type { TableActionOption, TableData } from '$types/table';
	import type { ApiResponse, ApiTableOptions } from '$types/api';
	import {
		getTableOptions,
		initTableData,
		subscribePlugins,
		subscribeItemsSelected
	} from '$utils/table';

	let data: TableData<ProductListObject> = initTableData();
	let tableStates: PluginStates<AnyPlugins> | null;
	let isRequestLoading = true;
	let selectedItemIds: string[] = [];

	const actions: TableActionOption<ProductListObject>[] = [
		{
			label: 'Delete',
			action: (prop) => {
				const id = prop.product_id;

				deleteProducts([id]);
			}
		}
	];

	const colBuilder = (table: TableType<never, any>) => {
		return table.createColumns([
			table.display({
				id: 'select',
				header: CheckboxHeader,
				cell: CheckboxCell,
				plugins: {
					sort: {
						disable: true
					}
				}
			}),
			table.column({
				accessor: 'name',
				header: SortHeader('Name')
			}),
			table.column({
				accessor: 'sku',
				header: SortHeader('SKU')
			}),
			table.display({
				id: 'action',
				header: () => '',
				cell: ActionCell(ProductListDropdown, fetchProducts),
			})
		]);
	};

	const fetchProducts = async () => {
		isRequestLoading = true;

		if (!$currentStore) {
			return;
		}

		const tableOptions = getTableOptions(tableStates);
		const response: ApiResponse<ApiTableOptions<ProductListObject[]>> | null = await fetchApi(
			`/product/list/${$currentStore}?${tableOptions}`
		);

		isRequestLoading = false;

		if (!response) {
			return;
		}

		if (!response.ok) {
			const message = response.message;
			toast.error(message);

			return;
		}

		const { table, pagination } = response.data;

		data.table.set(table);
		data.pagination.set(pagination);
	};

	const deleteProducts = async (products: string[]) => {
		isRequestLoading = true;

		const response: ApiResponse<DeleteProductList> | null = await fetchApi(`/product/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				product_id: products
			})
		});

		isRequestLoading = false;

		if (!response) {
			return;
		}

		if (!response.ok) {
			const message = response.message;
			toast.error(message);

			return;
		}

		const data = response.data;
		const totalSuccess = data.total_success;
		toast.success(`Successfully deleted ${totalSuccess} product(s)`);

		fetchProducts();
	};

	onMount(() => {
		currentStore.subscribe(async () => await fetchProducts());
		subscribePlugins(tableStates, () => fetchProducts());
		subscribeItemsSelected(
			tableStates,
			data,
			(selected) => (selectedItemIds = selected.map((product) => product.product_id))
		);
	});
</script>

<div class="flex flex-col w-full h-full gap-2">
	<div class="flex w-full justify-end gap-2">
		{#if selectedItemIds.length > 0}
			<Button on:click={() => deleteProducts(selectedItemIds)} class="bg-red-700"
				>Delete Product</Button
			>
		{/if}
		<Button>
		<CirclePlus size="20" />
			Add Product
		</Button>
	</div>

	<Table bind:tableStates {colBuilder} {data} loading={isRequestLoading} />
</div>
