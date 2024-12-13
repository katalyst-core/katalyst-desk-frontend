<script lang="ts">
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import type { Snippet } from 'svelte';

	import * as Dialog from '$ui/dialog';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';

	import { OrganizationAPI } from '$api/.';
	import { createOrganizationSchema } from '$schema/organization-schema';

  interface Props {
    open?: boolean;
    closeable?: boolean;
		children?: Snippet;
  }

  let { open = $bindable(false), closeable = true, children }: Props = $props();

	let isRequestLoading = $state(false);

	const { form, errors, enhance, submit } = superForm(defaults(zod(createOrganizationSchema)), {
		SPA: true,
		validators: zodClient(createOrganizationSchema),
		warnings: {
			duplicateId: false
		},
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const { name } = form.data;
			const response = await OrganizationAPI.createOrganization(name);

			isRequestLoading = false;

			if (!response || !response.ok) {
				setError(form, response?.message || 'Error');
				return;
			}

			const { organization_id: orgId } = response.data;

      const newUrl = `/app/${orgId}`;
      window.location.href = newUrl;
		}
	});
</script>

<Dialog.Root bind:open>
	{#if children}
	<Dialog.Trigger>
		{@render children()}
	</Dialog.Trigger>
	{/if}
	<Dialog.Content class="max-w-[425px]" interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title>Create new organization</Dialog.Title>
			<!-- <Dialog.Description>Specify the name of your organization</Dialog.Description> -->
		</Dialog.Header>

		<form method="POST" use:enhance>
			<div>
				<Label for="name">Organization Name</Label>
				<Input
					id="name"
					bind:value={$form.name}
					placeholder="Brad's Marketplace"
					disabled={isRequestLoading}
				/>
				{#if $errors.name}<p class="text-red-600 ml-[2px]">{$errors.name}</p>{/if}
			</div>
		</form>

		<Dialog.Footer>
			<Button onclick={submit} bind:loading={isRequestLoading}>Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
