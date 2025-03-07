<!-- Modified -->

<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
				outline:
					'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
			loading?: boolean;
			click?: (() => unknown | Promise<unknown>)
		};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { LoaderCircle } from 'lucide-svelte';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		loading = $bindable(false),
		click,
		children,
		...restProps
	}: ButtonProps = $props();

	const onClick = async () => {
		if (!click) return;

		loading = true;
		await click();
		loading = false;
	}
</script>

{#if href}
	<a bind:this={ref} class={cn(buttonVariants({ variant, size, className }))} {href} {...restProps}>
		{#if loading}
			<LoaderCircle class="mr-2 py-[2px] animate-spin" />
		{/if}
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size, className }))}
		{type}
		onclick={onClick}
		{...restProps}
	>
		{#if loading}
			<LoaderCircle class="mr-2 py-[2px] animate-spin" />
		{/if}
		{@render children?.()}
	</button>
{/if}
