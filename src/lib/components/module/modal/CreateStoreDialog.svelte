<script lang="ts">
	import toast from 'svelte-french-toast';
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

  import * as Dialog from '$ui/dialog';
  import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';

	import { createStoreSchema } from '$lib/schema';
	import { fetchApi } from '$lib/custom-fetch';
	import { fetchStores } from '$lib/services/store';
	import type { ApiResponse } from '$types/api';
	import type { StoreObject } from '$types/store';

  export let open: boolean = false;
  export let closeable: boolean = true;

  let isRequestLoading = false;

  const { form, errors, enhance, submit } = superForm(defaults(zod(createStoreSchema)), {
    SPA: true,
    validators: zodClient(createStoreSchema),
    async onUpdate({ form }) {
      if (!form.valid) {
        return;
      }

      try {
        const response: ApiResponse<StoreObject> | null = await fetchApi('/store/create', {
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
          const code = response.error?.code;
          if (code === 'STORE_NAME_ALREADY_EXIST') {
            message = 'Please choose another store name';
          }

          toast.error(message);
          setError(form, message);

          return;
        }

        const storeId = response.data.id;
        fetchStores(storeId);

        toast.success('Created new store');

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
      <Dialog.Title>Create new store</Dialog.Title>
      <Dialog.Description>Specify the name for your new store</Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance>
      <div>
        <Label for="name">Store Name</Label>
        <Input id="name" bind:value={$form.name} placeholder="dbrand" disabled={isRequestLoading} />
        {#if $errors.name}<p class="text-red-600 ml-[2px]">{ $errors.name }</p>{/if}
      </div>
    </form>

    <Dialog.Footer>
      <Button on:click={submit} bind:loading={isRequestLoading}>Create</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>