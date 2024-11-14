<!-- Modified -->

<script lang="ts">
	import * as Button from "$lib/components/ui/button/index.js";

	let { ref = $bindable(null), loading = $bindable(false), ...restProps }: Button.Props = $props();
</script>

<Button.Root type="submit" bind:ref bind:loading {...restProps} />
