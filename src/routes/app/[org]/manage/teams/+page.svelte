<script lang="ts">
	import { format } from 'date-fns';
	import { createRawSnippet, onMount } from 'svelte';
	import { type ColumnDef } from '@tanstack/table-core';
	import { page } from '$app/stores';

	import { renderComponent, renderSnippet } from '$ui/data-table';
	import { Separator } from '$ui/separator';
	import { Button } from '$ui/button';
	import { DataTable } from '$module/table';
	import TableAction from './table-action.svelte';
	import CreateTeamDialog from './create-team-dialog.svelte';

	import { OrganizationAPI } from '$api/index';
	import type { TeamListItem } from '$types/team-type';

	let isLoading: boolean = $state(true);
	let data: TeamListItem[] | null = $state([]);

	let activeOrgId = $derived($page.params.org);

	const fetchData = async () => {
		isLoading = true;

		const response = await OrganizationAPI.getTeamsByOrgId(activeOrgId);

		if (!response || !response.ok) return;

		data = response.data;

		isLoading = false;
	};

	const columns: ColumnDef<any>[] = [
		{
			accessorKey: 'name',
			header: 'Name'
		},
		{
			accessorKey: 'total_agent',
			header: 'Total Agent'
		},
		{
			accessorKey: 'timestamp',
			header: 'Created On',
			cell: (row) => {
				return format(new Date(row.getValue() as string), 'MMM d, yyyy');
			}
		},
		{
			id: 'actions',
			enableHiding: false,
			size: 1,
			cell: ({ row }) => {
				return renderComponent(TableAction, { teamId: row.original.team_id, callback: fetchData });
			}
		}
	];

	onMount(() => {
		fetchData();
	});
</script>

<h1 class="p-4">Teams</h1>

<Separator />

<div class="flex flex-col items-end px-4 py-6 space-y-4">
	<CreateTeamDialog callback={fetchData}>
		<Button>Add Team</Button>
	</CreateTeamDialog>
	<DataTable {columns} {data} onChange={fetchData} {isLoading} />
</div>
