<script lang="ts">
	import { format } from 'date-fns';
	import { type ColumnDef } from '@tanstack/table-core';
	import { page } from '$app/stores';

	import { Separator } from '$ui/separator';
	import { Button } from '$ui/button';
	import { DataTable } from '$module/table';

	import { OrganizationAPI } from '$api/index';
	import { renderComponent } from '$ui/data-table';
	import type { AgentListItem } from '$types/agent-type';
	import type { TableQueryOption } from '$types/table-type';
	import TableAction from './table-action.svelte';
	import AddAgentDialog from './add-agent-dialog.svelte';
	import TeamsColumn from './teams-column.svelte';
	import RolesColumn from './roles-column.svelte';
	import { agentHasPermission } from '$utils/index';
	import { AGENT_MANAGE } from '$lib/permissions';

	let isLoading: boolean = $state(true);
	let data: AgentListItem[] = $state([]);
	let itemCount: number = $state(0);
	let tableOptions: TableQueryOption = $state({});

	let activeOrgId = $derived($page.params.org);

	const fetchData = async () => {
		isLoading = true;

		const { ok, data: resData } = await OrganizationAPI.getAgents(activeOrgId, tableOptions);

		if (!ok) return;

		data = resData.result;
		itemCount = resData.pagination.total_item;

		isLoading = false;
	};

	const columns: ColumnDef<AgentListItem>[] = [
		{
			accessorKey: 'name',
			header: 'Name'
		},
		{
			accessorKey: 'email',
			header: 'Email'
		},
		{
			accessorKey: 'teams',
			header: 'Teams',
			cell: ({ row }) => {
				return renderComponent(TeamsColumn, {
					teams: row.original.teams,
					agentId: row.original.agent_id,
					callback: fetchData
				});
			}
		},
		{
			accessorKey: 'roles',
			header: 'Roles',
			cell: ({ row }) => {
				return renderComponent(RolesColumn, {
					roles: row.original.roles,
					agentId: row.original.agent_id,
					callback: fetchData
				});
			}
		},
		{
			accessorKey: 'timestamp',
			header: 'Joined on',
			size: 100,
			cell: (row) => {
				return format(new Date(row.getValue() as string), 'MMM d, yyyy');
			}
		},
		{
			id: 'actions',
			enableHiding: false,
			size: 40,
			cell: ({ row }) => {
				return renderComponent(TableAction, {
					agentId: row.original.agent_id,
					callback: fetchData
				});
			}
		}
	];
</script>

<h1 class="p-4">Agents</h1>

<Separator />

<div class="flex flex-col items-end px-4 py-6 space-y-4">
	{#if agentHasPermission(AGENT_MANAGE)}
		<AddAgentDialog callback={fetchData}>
			<Button>Add Agent</Button>
		</AddAgentDialog>
	{:else}
		<Button disabled>Add Agent</Button>
	{/if}
	<DataTable {columns} {data} onChange={fetchData} {isLoading} {itemCount} pagination />
</div>
