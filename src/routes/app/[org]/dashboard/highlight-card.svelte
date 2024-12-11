<script lang="ts">
  import * as Card from '$ui/card';

  interface Props {
    label: string;
    value: string | number;
  }

  let { label, value }: Props = $props();
</script>

<Card.Root class="bg-secondary">
  <Card.Header
    class="flex flex-row items-center justify-between space-y-0 pb-2"
  >
    <Card.Title class="text-base font-medium">{label}</Card.Title>
  </Card.Header>
  <Card.Content>
    <div class="text-2xl font-bold">{value}</div>
  </Card.Content>
</Card.Root>