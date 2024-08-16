<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
  import { Plus, Trash } from 'lucide-svelte';

	import * as Form from '$ui/form';
	import * as Card from '$ui/card';
	import * as RadioGroup from '$ui/radio-group';
	import { Button } from '$ui/button';
  import { Label } from '$ui/label';
	import { LoadingPage } from '$module/page';

	import { createProductSchema } from '$lib/schema';
	import toast from 'svelte-french-toast';

	let isRequestLoading = false;
	let isFormLoading = true;
  let selectedDiscountType: 'price' | 'percentage' = 'price';

	const form = superForm(defaults(zod(createProductSchema)), {
		SPA: true,
		validators: zodClient(createProductSchema),
		async onUpdate({ form }) {}
	});
	const { form: formData, enhance } = form;
	isFormLoading = !form;

	const addWholesalePrice = () => {
		const length = $formData.wholesale.length;
		if (length >= 5) {
			toast.error('Maximum of 5 wholesale prices');
			return;
		}

		$formData.wholesale = [
			...$formData.wholesale,
			{
				min_quantity: 0,
				price: 0
			}
		];
	};

  const removeWholesalePrice = (idx: number) => {
    $formData.wholesale = $formData.wholesale.filter((_, i) => i !== idx)
  };

	const clearDiscountValues = () => {
		$formData.discount_percentage = 0;
		$formData.discount_price = 0;
	}
</script>

<LoadingPage loading={isFormLoading}>
	<form use:enhance class="flex flex-col items-center">
		<div class="grid max-w-xl w-full gap-4">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-xl">Basic Information</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					<Form.Field {form} name="name">
						<Form.Control>
							<Form.Label required>Name</Form.Label>
							<Form.Input
								bind:value={$formData.name}
								disabled={isRequestLoading}
								placeholder="Name"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="description">
						<Form.Control>
							<Form.Label required>Description</Form.Label>
							<Form.Textarea
								bind:value={$formData.description}
								disabled={isRequestLoading}
								placeholder="Description"
								rows={4}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Fieldset {form} name="condition">
						<Form.Legend required>Condition</Form.Legend>
						<RadioGroup.Root bind:value={$formData.condition}>
							<div class="flex items-center space-x-2">
								<Form.Control let:attrs>
									<RadioGroup.Item value="new" {...attrs} />
									<Form.Label class="font-normal pb-0.5">New</Form.Label>
								</Form.Control>
							</div>
							<div class="flex items-center space-x-2">
								<Form.Control let:attrs>
									<RadioGroup.Item value="used" {...attrs} />
									<Form.Label class="font-normal pb-0.5">Used</Form.Label>
								</Form.Control>
							</div>
							<RadioGroup.Input name="type" />
						</RadioGroup.Root>
						<Form.FieldErrors />
					</Form.Fieldset>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="text-xl">Attributes</Card.Title>
				</Card.Header>
				<Card.Content>
					<Form.Field {form} name="brand">
						<Form.Control>
							<Form.Label>Brand</Form.Label>
							<Form.Input
								bind:value={$formData.brand}
								disabled={isRequestLoading}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Sales Information</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-4">
					<div class="grid grid-cols-2 gap-2">
						<Form.Field {form} name="stock">
							<Form.Control>
								<Form.Label required>Stock</Form.Label>
								<Form.Input
									bind:value={$formData.stock}
									disabled={isRequestLoading}
									type="number"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="sku">
							<Form.Control>
								<Form.Label required>SKU</Form.Label>
								<Form.Input
									bind:value={$formData.sku}
									disabled={isRequestLoading}
									placeholder="SKU"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<Form.Field {form} name="price">
						<Form.Control>
							<Form.Label required>Price</Form.Label>
							<Form.Input
								bind:value={$formData.price}
								disabled={isRequestLoading}
								placeholder="20.000"
								type="price"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

          <Label class="font-semibold">Discount</Label>
          <RadioGroup.Root bind:value={selectedDiscountType} on:change={clearDiscountValues}>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex items-center gap-2">
                <RadioGroup.Item id="discount_price" value="price" />
                <Label for="discount_price" class="pb-0.5">Price</Label>
              </div>
              <div class="flex items-center gap-2">
                <RadioGroup.Item id="discount_percentage" value="percentage" />
                <Label for="discount_percentage" class="pb-0.5">Percentage</Label>
              </div>
            </div>
          </RadioGroup.Root>

          {#if selectedDiscountType === 'price'}
            <Form.Field {form} name="discount_price">
              <Form.Control>
                <Form.Input
                  bind:value={$formData.discount_price}
                  disabled={isRequestLoading}
                  placeholder="20.000"
                  type="price"
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          {/if}

          {#if selectedDiscountType === 'percentage'}
            <Form.Field {form} name="discount_price">
              <Form.Control>
                <Form.Input
                  bind:value={$formData.discount_percentage}
                  disabled={isRequestLoading}
                  placeholder="20.000"
                  type="number"
									min="0"
									max="100"
                  suffix="%"
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          {/if}

					<Form.Fieldset {form} name="wholesale">
						<Form.Legend>Wholesale</Form.Legend>
						{#each $formData.wholesale as _, i}
              <div class="flex items-center gap-2">
                <div class="grid grid-cols-2 gap-2 w-full">
                  <Form.ElementField {form} name="wholesale[{i}].min_quantity" class="flex w-full items-center">
                    <Form.Control let:attrs>
                      <Form.Input
                        bind:value={$formData.wholesale[i].min_quantity}
                        type="number"
                        suffix="pcs"
                        {...attrs}
                      />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>

                  <Form.ElementField {form} name="wholesale[{i}].price" class="flex w-full items-center">
                    <Form.Control let:attrs>
                      <Form.Input
                        bind:value={$formData.wholesale[i].price}
                        type="price"
                        {...attrs}
                      />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </div>
                <Button
                  variant="destructive"
                  on:click={() => removeWholesalePrice(i)}
                  class="flex justify-center items-center w-10 h-10 p-2"
                >
                  <Trash class="w-6 h-6 text-gray-50" />
                </Button>
              </div>
						{/each}

						<Button
              class="w-full"
              on:click={addWholesalePrice}
            >
              <Plus class="w-5 h-5" />
              Add Price
            </Button>
					</Form.Fieldset>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="text-xl">Shipping information</Card.Title>
					<Card.Description>Product information used for shipping specification</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-2">
					<div class="grid grid-cols-3 gap-2">
						<Form.Field {form} name="dimension_width">
							<Form.Control>
								<Form.Label required>Width</Form.Label>
								<Form.Input
									bind:value={$formData.dimension_width}
									disabled={isRequestLoading}
									type="number"
									suffix="cm"
									placeholder="Width"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="dimension_height">
							<Form.Control>
								<Form.Label required>Height</Form.Label>
								<Form.Input
									bind:value={$formData.dimension_height}
									disabled={isRequestLoading}
									type="number"
									suffix="cm"
									placeholder="Height"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="dimension_length">
							<Form.Control>
								<Form.Label required>Length</Form.Label>
								<Form.Input
									bind:value={$formData.dimension_length}
									disabled={isRequestLoading}
									type="number"
									suffix="cm"
									placeholder="Length"
								/>
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<Form.Field {form} name="weight">
						<Form.Control>
							<Form.Label required>Weight</Form.Label>
							<Form.Input
								bind:value={$formData.weight}
								disabled={isRequestLoading}
								type="number"
								suffix="gr"
								placeholder="Weight"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>
		</div>
	</form>
</LoadingPage>
