<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Column, createTable, Render, Subscribe, type TableViewModel, type Table as TableType } from 'svelte-headless-table';
  import { keyed } from 'svelte-keyed';

  import * as Pagination from '$lib/components/ui/pagination';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { addPagination, addSelectedRows, addSortBy, type AnyPlugins, type PluginStates } from 'svelte-headless-table/plugins';
	import type { PaginationData, TableData } from '$utils/table';

  export let data: TableData;
  export let columnBuilder: (table: TableType<never, any>) => Column<never, any>[];
  export let loading: boolean = false;
  export let tableStates: PluginStates<AnyPlugins> | null = null;

  const { table: tableData, pagination } = data;

  const totalItem = keyed(pagination, 'total_item');

  const table = createTable(tableData, {
    sort: addSortBy({
      toggleOrder: ['asc', 'desc'],
      serverSide: true,
    }),
    select: addSelectedRows(),
    page: addPagination({
      serverSide: true,
      serverItemCount: totalItem,
    }),
  });

  const columns = columnBuilder(table);
  const tableView = table.createViewModel(columns);
  const { tableAttrs, headerRows, tableBodyAttrs, pageRows, pluginStates } = tableView;
  const { pageIndex, pageSize } = pluginStates.page;

  tableStates = pluginStates;

  pagination.subscribe((paginate: PaginationData) => {
    $pageSize = paginate.per_page;
    $pageIndex = paginate.current_page;
  });
</script>

<div class="flex flex-col gap-1">
  <Table.Root {...$tableAttrs} class="border rounded-md">
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe
                attrs={cell.attrs()}
                let:attrs
              >
                <Table.Head {...attrs}>
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
              <Table.Row {...rowAttrs}>
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell {...attrs}>
                      <Render of={cell.render()} />
                    </Table.Cell>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        {:else}
          <Table.Row>
            <Table.Cell
              colspan={columns.length}
              class="text-center"
            >
              No results
            </Table.Cell>
          </Table.Row>
        {/if}
      {:else}
        <Table.Row>
          <Table.Cell
            colspan={columns.length}
            class="text-center"
          >
            Loading...
          </Table.Cell>
        </Table.Row>
      {/if}
    </Table.Body>
  </Table.Root>

  <Pagination.Root count={$totalItem} perPage={$pageSize} page={$pageIndex} onPageChange={(page) => $pageIndex = page} let:pages let:currentPage class="items-end">
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