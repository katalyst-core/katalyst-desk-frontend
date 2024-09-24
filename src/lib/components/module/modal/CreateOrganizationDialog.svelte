<script lang="ts">
	import { defaults, setError, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';

  import * as Dialog from '$ui/dialog';
  import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label';

	import * as OrganizationAPI from '$api/organization-api';
	import { createOrganizationSchema } from '$schema/organization-schema';

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

      isRequestLoading = true;

      const { name } = form.data;
      const response = await OrganizationAPI.createOrganization(name);

      isRequestLoading = false;

      if (response && !response.ok) {
        setError(form, response.message);
        return;
      }

      OrganizationAPI.fetchOrganizationList();

      toast.success('Created new organization');

      open = false;
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