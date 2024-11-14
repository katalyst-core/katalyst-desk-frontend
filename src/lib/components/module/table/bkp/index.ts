import { createRender, type DisplayLabel, type HeaderLabel } from 'svelte-headless-table';
import type {
	AnyPlugins,
	SelectedRowsPropSet,
	SelectedRowsState,
	TablePlugin
} from 'svelte-headless-table/plugins';
import { derived } from 'svelte/store';

import Table from './Table.svelte';
import TableCheckbox from './TableCheckbox.svelte';
import TableSortHeader from './TableSortHeader.svelte';
import TableAction from './TableAction.svelte';
import type { ComponentType } from 'svelte';

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
			}))
		);
	};

	return header;
};

type CheckboxSelect = {
	select: TablePlugin<
		AnyPlugins,
		SelectedRowsState<AnyPlugins>,
		Record<string, never>,
		SelectedRowsPropSet
	>;
};

const CheckboxCell: DisplayLabel<never, CheckboxSelect> = ({ row }, { pluginStates }) => {
	const { getRowState } = pluginStates.select;
	const { isSelected } = getRowState(row);
	return createRender(TableCheckbox, {
		checked: isSelected
	});
};

const ActionCell = (content: ComponentType, refresh: () => void) => {
	const cell: DisplayLabel<never, AnyPlugins> = ({ row }) => {
		const prop = row.isData() && row.original ? row.original : null;
		return createRender(TableAction, {
			content,
			refresh,
			prop: prop
		});
	};

	return cell;
};

export {
	Table,
	TableCheckbox,
	TableSortHeader,
	TableAction,
	CheckboxHeader,
	SortHeader,
	CheckboxCell,
	ActionCell
};
