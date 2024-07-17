import { createRender, type DataLabel, type HeaderLabel } from 'svelte-headless-table';
import type { AnyPlugins, SelectedRowsPropSet, SelectedRowsState, TablePlugin } from 'svelte-headless-table/plugins';

import Table from './Table.svelte';
import TableCheckbox from './TableCheckbox.svelte';
import TableSortHeader from './TableSortHeader.svelte';
import { derived } from 'svelte/store';

const CheckboxHeader: HeaderLabel<never, AnyPlugins> = (_, { pluginStates }) => {
  const { allPageRowsSelected } = pluginStates.select;
  return createRender(TableCheckbox, {
    checked: allPageRowsSelected
  });
};

const SortHeader = (label: string) => {
  const header: HeaderLabel<never, AnyPlugins> = (cell) => {
    return createRender(
      TableSortHeader,
      derived([cell.props()], ([{ sort }]) => ({
        label,
        ...sort
      })
    ));
  };

  return header;
}

type CheckboxSelect = {
  select: TablePlugin<AnyPlugins, SelectedRowsState<AnyPlugins>, Record<string, never>, SelectedRowsPropSet>;
}

const CheckboxCell: DataLabel<never, CheckboxSelect> = ({ row }, { pluginStates }) => {
  const { getRowState } = pluginStates.select;
  const { isSelected } = getRowState(row);
  return createRender(TableCheckbox, {
    checked: isSelected
  });
};

export {
  Table,
  TableCheckbox,
  TableSortHeader,
  CheckboxHeader,
  SortHeader,
  CheckboxCell,
}