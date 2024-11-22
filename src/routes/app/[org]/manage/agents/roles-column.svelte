<script lang="ts">
	import { Plus, X } from 'lucide-svelte';
	import { page } from '$app/stores';

	import { Badge } from '$ui/badge';
	import { Combobox, type ComboboxItem } from '$ui/combobox';

	import { OrganizationAPI } from '$api/.';

	interface Props {
		roles: {
			role_id: string;
			name: string;
		}[];
		agentId: string;
		callback: (...args: any[]) => any;
	}

	let { roles, agentId, callback }: Props = $props();

	let items: ComboboxItem[] | null = $state(null);
	let open = $state(false);
	let isLoading = $state(false);

	let orgId = $derived($page.params.org);

	$effect(() => {
		if (open) fetchRoles();
	});

	const fetchRoles = async () => {
		const { ok, data: resData } = await OrganizationAPI.getUnassignedRoles(orgId, agentId);

		if (!ok) return;

		items = resData.map((d) => ({ value: d.role_id, label: d.name }));
	};

	const onSelect = async (roleId: string) => {
		isLoading = true;

		await OrganizationAPI.addRoleToAgent(orgId, agentId, roleId);

    callback();

		isLoading = false;
	};

	const deleteClick = async (roleId: string) => {
		isLoading = true;

		await OrganizationAPI.removeRoleFromAgent(orgId, agentId, roleId);

    callback();

		isLoading = false;
	}
</script>

<div class="flex flex-wrap gap-1">
	{#each roles as role (role.role_id)}
		<Badge class="flex items-center px-2 gap-1"
			>{role.name}
			<button onclick={() => deleteClick(role.role_id)} disabled={isLoading}>
				<X class="w-3 h-3" />
			</button>
		</Badge>
	{/each}
	<Combobox {items} {onSelect} bind:open disabled={isLoading}>
		<button disabled={isLoading}>
			<Badge class="p-1"><Plus class="w-3 h-3" /></Badge>
		</button>
	</Combobox>
</div>
