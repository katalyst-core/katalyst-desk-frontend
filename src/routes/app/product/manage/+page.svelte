<script lang="ts">
  import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';
  import { createRender, type Table as TableType } from 'svelte-headless-table';
  import { type AnyPlugins, type PluginStates } from 'svelte-headless-table/plugins';
	import toast from 'svelte-french-toast';

  import { fetchApi } from '$lib/custom-fetch';
	import { SortHeader, TableSortHeader } from '$lib/components/module/table';
	import { currentStore } from '$stores/store';
	import { getTableOptions, getItemsSelected, initTableData, subscribePlugins, type TableData, subscribeItemsSelected } from '$utils/table';
	import { CheckboxCell, CheckboxHeader, Table as Table } from '$lib/components/module/table';
	import { Button } from '$lib/components/ui/button';

  let data: TableData = initTableData();
  let tableStates: PluginStates<AnyPlugins> | null;
  let currentStoreId: string;
  let isRequestLoading = true;
  let selectedItems: unknown[] = [];

  const columnBuilder = (table: TableType<never, any>) => table.createColumns([
    table.column({
      accessor: 'product_id',
      header: CheckboxHeader,
      cell: CheckboxCell,
      plugins: {
        sort: {
          disable: true,
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
    })
  ]);

  const fetchProducts = async () => {
    isRequestLoading = true;

    if (!currentStoreId) {
      return;
    }

    const tableOptions = getTableOptions(tableStates);
    const response = await fetchApi(`/product/list/${currentStoreId}?${tableOptions}`);
    const result = await response.json();

    if (!response.ok) {
      const message = result.message;
      toast.error(message);

      return;
    }

    isRequestLoading = false;

    const { table, pagination } = result.data;

    data.table.set(table)
    data.pagination.set(pagination);
  };

  onMount(() => {
    currentStore.subscribe(async (storeId) => {
      if (!storeId) {
        return;
      }

      currentStoreId = storeId;
      await fetchProducts();
    });

    subscribePlugins(tableStates, () => fetchProducts());
    subscribeItemsSelected(tableStates, data, (selected) => selectedItems = selected);
  });
</script>

<div class="flex flex-col w-full h-full gap-2">
  <div class="flex w-full justify-end gap-2">
    {#if selectedItems.length > 0}
      <Button class="bg-red-700">Delete Product</Button>
    {/if}
    <Button>Add Product</Button>
  </div>

  <Table
    bind:tableStates
    {columnBuilder}
    {data}
    loading={isRequestLoading}
  />
</div>
