<script lang="ts">
	import { Trash } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { fetchApi } from '$lib/custom-fetch';
	import type { ProductListObject } from '$types/product';
	import { Button } from '$lib/components/ui/button';

	export let prop: ProductListObject;
	export let refresh: () => void;

	let isRequestLoading = false;
	let isDeleteOpen = false;

	const deleteProduct = async () => {
		isRequestLoading = true;

		const productId = prop.product_id;
		const response = await fetchApi('/product/delete', {
			method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
			body: JSON.stringify({
				product_id: [productId]
			})
		});

		isRequestLoading = false;

		if (!response) {
			return;
		}

		if (!response.ok) {
			const message = response.message;
			toast.error(message);

			return;
		}

    isDeleteOpen = false;
		toast.success('Successfully deleted');
		refresh();
	};
</script>

<DropdownMenu.Content>
	<DropdownMenu.Item on:click={() => (isDeleteOpen = true)} class="cursor-pointer text-red-700">
		<Trash class="mr-2 w-4 h-4" />
		Delete
	</DropdownMenu.Item>
</DropdownMenu.Content>

<AlertDialog.Root bind:open={isDeleteOpen}>
	<AlertDialog.Content class="max-w-[425px]">
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description
				>You will be deleting {prop.name}. This action is irreversible!</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <Button loading={isRequestLoading} on:click={deleteProduct} >Delete</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
