<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
	import { zod, zodClient } from "sveltekit-superforms/adapters";

  import * as Form from '$ui/form'
  import * as Card from "$ui/card";
	import * as RadioGroup from "$ui/radio-group";
  import { LoadingPage } from '$module/page';

	import { createProductSchema } from "$lib/schema";

  let isRequestLoading = false;
  let isFormLoading = true;

  const form = superForm(defaults(zod(createProductSchema)), {
    SPA: true,
    validators: zodClient(createProductSchema),
    async onUpdate({ form }) {

    }
  });
  const { form: formData, enhance } = form;
  isFormLoading = !form;
</script>

<LoadingPage loading={isFormLoading}>
  <form use:enhance class="flex flex-col items-center">
    <div class="grid max-w-xl w-full gap-4">
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-xl">Product Details</Card.Title>
          <Card.Description>General information of your product</Card.Description>
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
          <Card.Title>Pricing</Card.Title>
          <Card.Description>Specify the product pricing</Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-2">
          <Form.Field {form} name="price">
            <Form.Control>
              <Form.Label required>Price</Form.Label>
              <Form.Input
                bind:value={$formData.price}
                disabled={isRequestLoading}
                placeholder="20.000"
                type="price"
                prefix="Rp"
              />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title class="text-xl">Shipping information</Card.Title>
          <Card.Description>Product information used for shipping specification</Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-2">
          <div class="grid grid-cols-3 gap-3">
            <Form.Field {form} name="dimension_width">
              <Form.Control>
                <Form.Label>Width</Form.Label>
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
                <Form.Label>Height</Form.Label>
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
                <Form.Label>Length</Form.Label>
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
              <Form.Label>Weight</Form.Label>
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