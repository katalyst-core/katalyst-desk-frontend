<script lang="ts">
	import * as Input from '$lib/components/ui/input';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		suffix?: string;
	}

	let { ref = $bindable(null), value = $bindable(), ...restProps }: WithElementRef<HTMLInputAttributes> & Props =
		$props();
</script>

<Input.Root bind:ref bind:value {...restProps} />
