<script lang="ts">
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$ui/form';
  import { Label } from '$ui/label';
  import { Input } from '$ui/input';
	import { Separator } from '$ui/separator';
	import { LoadingPage } from '$module/page';

	import { AgentAPI } from '$api/index';
	import { modifyAgentSchema } from '$schema/agent-schema';

	import * as Dialog from '$ui/dialog';
	import type { AgentInfoResponse } from '$types/agent-type';

	interface Props {
		open: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	let isRequestLoading = $state(false);
	let isFormLoading = $state(true);
  let agentData: AgentInfoResponse | null = $state(null);

	const form = superForm(defaults(zod(modifyAgentSchema)), {
		SPA: true,
		validators: zodClient(modifyAgentSchema),
		async onUpdate({ form }) {
			if (!form.valid) {
				return;
			}

			isRequestLoading = true;

			const { name } = form.data;

			const { ok, message } = await AgentAPI.modifyAgent(name);

			isRequestLoading = false;
			if (!ok) {
				setError(form, message);
				return;
			}

			toast.success('Successfully modified organization');

			const newUrl = $page.url.pathname;
			window.location.href = newUrl;
		}
	});

	const { form: formData, enhance } = form;

	const fetchOrganizationInfo = async () => {
		const { ok, data } = await AgentAPI.getAgentInfo();

		if (!ok) return;

		$formData.name = data.name;
    agentData = data;

		isFormLoading = false;
	};

	onMount(() => {
		fetchOrganizationInfo();
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>Settings</Dialog.Header>
		{#if isFormLoading}
			<LoadingPage />
		{:else}
			<form method="POST" use:enhance class="flex flex-col justify-start gap-3">
				<Form.Field {form} name="name">
					<Form.Control>
						<Form.Label>Name</Form.Label>
						<Form.Input
							bind:value={$formData.name}
							disabled={isRequestLoading}
							placeholder="Name"
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
        <div>
          <Label>Email</Label>
          <Input
            value={agentData?.email || ''}
            disabled
            placeholder="Name"
          />
				</div>
				<Form.Button bind:loading={isRequestLoading} class="mt-2">Apply Changes</Form.Button>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
