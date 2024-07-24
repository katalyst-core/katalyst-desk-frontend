import type { Button as ButtonPrimitive } from "bits-ui";
import { type VariantProps, tv } from "tailwind-variants";
import Root from "./button.svelte";

const buttonVariants = tv({
	base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  hover:brightness-75 hover:opacity-90",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow",
			destructive:
				"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline:
				"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			icon: "bg-transparent hover:opacity-75"
		},
		size: {
			default: "h-9 px-4 py-2 text-sm",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-4",
			icon: "h-9 w-9",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
	loading?: boolean;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants,
};
