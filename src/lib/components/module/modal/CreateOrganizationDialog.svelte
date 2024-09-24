<script lang="ts">
	import toast from 'svelte-french-toast';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

  import * as Dialog from '$ui/dialog';
  import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';

	import { fetchApi } from '$lib/custom-fetch';
	import type { ApiResponse } from '$types/api';
	import { createOrganizationSchema } from '$lib/schema/organization-schema';
	import type { CreateOrganizationResponse } from '$types/organization-type';
	import { fetchAllOrganization } from '$lib/api/organization-api';

  export let open: boolean = false;
  export let closeable: boolean = true;

  let isRequestLoading = false;

  const { form, errors, enhance, submit } = superForm(defaults(zod(createOrganizationSchema)), {
    SPA: true,
    validators: zodClient(createOrganizationSchema),
    warnings: {
      duplicateId: false,
    },
    async onUpdate({ form }) {
      if (!form.valid) {
        return;
      }

      try {
        const response: ApiResponse<CreateOrganizationResponse> | null = await fetchApi('/organization/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: form.data.name
          })
        });

        if (!response) {
          return;
        }

        if (!response.ok) {
          isRequestLoading = false;

          let message = response.message;

          toast.error(message);
          setError(form, message);

          return;
        }

        fetchAllOrganization();

        toast.success('Created new organization');

        open = false;
      } catch (_) {
        isRequestLoading = false;
        toast.error('An error occurred');
      }
    }
  });
</script>

<Dialog.Root bind:open={open} closeOnEscape={closeable} closeOnOutsideClick={closeable}>
  <Dialog.Content class="max-w-[425px]" closeButton={closeable}>
    <Dialog.Header>
      <Dialog.Title>Create new organization</Dialog.Title>
      <!-- <Dialog.Description>Specify the name of your organization</Dialog.Description> -->
    </Dialog.Header>

    <form method="POST" use:enhance>
      <div>
        <Label for="name">Organization Name</Label>
        <Input id="name" bind:value={$form.name} placeholder="Brad's Marketplace" disabled={isRequestLoading} />
        {#if $errors.name}<p class="text-red-600 ml-[2px]">{ $errors.name }</p>{/if}
      </div>
    </form>

    <Dialog.Footer>
      <Button on:click={submit} bind:loading={isRequestLoading}>Create</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>