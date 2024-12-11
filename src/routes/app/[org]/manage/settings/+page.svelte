<script lang="ts">
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$ui/form';
	import * as AlertDialog from '$ui/alert-dialog';
	import { Separator } from '$ui/separator';
	import { LoadingPage } from '$module/page';

	import { OrganizationAPI } from '$api/index';
	import { modifyOrganizationSchema } from '$schema/organization-schema';
	import Button from '$ui/button/button.svelte';

	let isRequestLoading = $state(false);
	let isFormLoading = $state(true);
	let orgId = $derived($page.params.org);

	const form = superForm(defaults(zod(modifyOrganizationSchema)), {
		SPA: true,
		validators: zodClient(modifyOrganizationSchema),
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const { name } = form.data;

			const { ok, message } = await OrganizationAPI.modifyOrganization(orgId, name);

			isRequestLoading = false;
			if (!ok) {
				setError(form, message);
				return;
			}

			toast.success('Successfully modified organization');

			const newUrl = `/app/${orgId}/manage/settings`;
			window.location.href = newUrl;
		}
	});

	const { form: formData, enhance } = form;

	const fetchOrganizationInfo = async () => {
		const { ok, data } = await OrganizationAPI.getOrganization(orgId);

		if (!ok) return;

		$formData.name = data.name;

		isFormLoading = false;
	};

	const deleteOrganization = async () => {
		const { ok } = await OrganizationAPI.deleteOrganization(orgId);

		if (!ok) return;

		const newUrl = `/app`;
		window.location.href = newUrl;
	};

	onMount(() => {
		fetchOrganizationInfo();
	});
</script>

<h1 class="p-4">Settings</h1>

<Separator />

{#if isFormLoading}
	<LoadingPage />
{:else}
	<div class="w-full h-full p-4 space-y-8">
		<form method="POST" use:enhance class="flex flex-col justify-start w-96 gap-3">
			<Form.Field {form} name="name">
				<Form.Control>
					<Form.Label>Organization Name</Form.Label>
					<Form.Input bind:value={$formData.name} disabled={isRequestLoading} placeholder="Name" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button bind:loading={isRequestLoading}>Apply Changes</Form.Button>
		</form>

		<div>
			<h4>Delete Organization</h4>
			<p class="text-gray-400">This will delete the organization including all the data</p>

			<AlertDialog.Root>
				<AlertDialog.Trigger>
					<Button variant="destructive" class="mt-4">Delete Organization</Button>
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>Are you sure?</AlertDialog.Header>
					<AlertDialog.Description
						>You will delete this organization and remove all of its data</AlertDialog.Description
					>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
						<Button click={async () => deleteOrganization()}>Yes, Delete</Button>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
	</div>
{/if}
