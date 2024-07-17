<script lang="ts">
  import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';
  import { createRender, type Table as TableType } from 'svelte-headless-table';
  import { type AnyPlugins, type PluginStates } from 'svelte-headless-table/plugins';
	import toast from 'svelte-french-toast';

  import { fetchApi } from '$lib/custom-fetch';
	import { SortHeader, TableSortHeader } from '$lib/components/module/table';
	import { currentStore } from '$stores/store';
	import { getTableOptions, initTableData, subscribePlugins, type TableData } from '$utils/table';
	import { CheckboxCell, CheckboxHeader, Table as Table } from '$lib/components/module/table';

  let data: TableData = initTableData();
  let tableStates: PluginStates<AnyPlugins> | null;
  let currentStoreId: string;
  let isRequestLoading = true;

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
  });

  const selectedItems = () => {
    if (!tableStates) {
      return;
    }

    console.log(tableStates);

    const { allRowsSelected } = tableStates.select;

    allRowsSelected.subscribe((test) => console.log(test));
  }
</script>

<div class="rounded-md bg-gray-50 p-3">
  <button on:click={selectedItems}>Check</button>
  <Table
    bind:tableStates
    {columnBuilder}
    {data}
    loading={isRequestLoading}
  />
</div>
