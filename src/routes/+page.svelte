<script>
	import { ChartColumn, BadgeCheck } from 'lucide-svelte';
	import { Button } from '$ui/button';
	import {Label} from '$ui/label';
	import {Textarea} from '$ui/textarea';
	import { Input } from "$ui/input";
	import * as Select from '$ui/select';
	import * as Card from '$ui/card';
	import * as Tabs from '$ui/tabs';
	import * as Accordion from "$lib/components/ui/accordion";

	import img from '$lib/images/logo_omni.svg';
	import ibx from '$lib/images/inbox.png';

	// @ts-ignore
	function scrollIntoView({ target }) {
		const el = document.querySelector(target.getAttribute('href'));
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}

	const plans = [
		{
			name: 'Free',
			features: [
				{ label: 'Number of Users', value: '20 Pages' },
				{ label: 'Users Per Page', value: '5 Pages' },
				{ label: 'Includes essential features to get started', value: true },
				{ label: 'More advanced features for increased productivity', value: true },
				{ label: 'Designing & Development', value: false },
				{ label: 'Customizable options to meet your specific needs', value: false },
				{ label: 'Secure data storage', value: false },
				{ label: 'Email Support', value: false },
				{ label: '24/7 customer support', value: false },
				{ label: 'Analytics and reporting', value: false },
				{ label: 'Account Management', value: false }
			]
		},
		{
			name: 'Standard',
			features: [
				{ label: 'Number of Users', value: '600 Pages' },
				{ label: 'Users Per Page', value: '50 Pages' },
				{ label: 'Includes essential features to get started', value: true },
				{ label: 'More advanced features for increased productivity', value: true },
				{ label: 'Designing & Development', value: true },
				{ label: 'Customizable options to meet your specific needs', value: true },
				{ label: 'Secure data storage', value: true },
				{ label: 'Email Support', value: true },
				{ label: '24/7 customer support', value: true },
				{ label: 'Analytics and reporting', value: true },
				{ label: 'Account Management', value: true }
			]
		},
		{
			name: 'Premium',
			features: [
				{ label: 'Number of Users', value: 'Unlimited' },
				{ label: 'Users Per Page', value: 'Unlimited' },
				{ label: 'Includes essential features to get started', value: true },
				{ label: 'More advanced features for increased productivity', value: true },
				{ label: 'Designing & Development', value: true },
				{ label: 'Customizable options to meet your specific needs', value: true },
				{ label: 'Secure data storage', value: true },
				{ label: 'Email Support', value: true },
				{ label: '24/7 customer support', value: true },
				{ label: 'Analytics and reporting', value: true },
				{ label: 'Account Management', value: true }
			]
		}
	];
</script>

<header
	class="sticky top-0 z-50 flex items-center p-6 h-24 justify-between text-lg bg-white border border-b-2 shadow">
	<a href=" " class="items-start pl-6 justify-start"><img class="h-16" src={img} alt="" /></a>
	<div class="flex space-x-8 items-center justify-end sm:justify-end">
		<a href="#landing-features" on:click|preventDefault={scrollIntoView}>Features</a>
		<a href="#landing-pricing" on:click|preventDefault={scrollIntoView}>Pricing</a>
		<a href="#landing-aboutus" on:click|preventDefault={scrollIntoView}>About Us</a>
		<div class="space-x-2">
			<Button variant="outline" href="/auth/sign-in" class="text-lg px-7 py-6">Sign In</Button>
			<Button href="/auth/sign-up" class="text-lg px-7 py-6">Sign Up</Button>
		</div>
	</div>
</header>

<div class="flex h-svh justify-center">
	<div class="flex flex-col items-center px-24 py-24">
		<h1 class="font-bold text-8xl/[90px] text-slate-800 text-center py-4">
			<span class="bg-gradient-to-r bg-clip-text text-transparent from-blue-500 to-blue-600">
				Reach
			</span>
			you better. <br /> Get responses
			<span class="bg-gradient-to-r bg-clip-text text-transparent from-orange-600 to-orange-500">
				faster</span
			>.
		</h1>
		<p class="font-semibold text-slate-500 text-2xl py-2 text-center">
			Transform the way you connect with your customer.
		</p>
		<div class="flex items-center space-x-8">
			<Button size="lg" class="text-xl my-6 font-semibold ">Try for free</Button>
			<a href="#" class="text-xl font-semibold">Get a demo ></a>
		</div>
	</div>
</div>

<div
	class="flex flex-col justify-center items-center bg-[#dce8f1] h-svh py-8"
	id="landing-features"
>
	<h1
		class="text-2xl font-medium pb-5 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text"
	>
		What is Katalyst-desk?
	</h1>
	<p class="text-5xl font-bold pb-4 justify-center items-center text-center">
		Reach Customers Everywhere. <br /> Respond to Their Needs Anywhere.
	</p>
	<p class="text-xl pb-4 justify-center items-center text-center">
		Katalyst Desk help streamline your customer support with our omnichannel solution, <br /> enabling
		you to deliver personalized, timely, and cohesive experiences that exceed expectations.
	</p>

	<div class="pt-6">
		<div class="flex space-x-4 w-full h-full">
			<div class="flex flex-col justify-between items-center w-72 h-80 px-6 py-9 border border-gray-400 rounded-lg">
				<img class="h-36" src={ibx} alt="" />
				<div class="flex flex-col items-center">
					<h3 class="text-xl font-semibold py-2">Unified Inbox</h3>
					<p class="text-sm text-center text-gray-700">
						Consolidate messages from various platforms (WhatsApp, LINE, email, etc.) into one view.
					</p>
				</div>
			</div>
			<div class="flex flex-col justify-between items-center w-72 h-80 px-6 py-9 border border-gray-400 rounded-lg">
				<img class="h-36" src={ibx} alt="" />
				<div class="flex flex-col items-center">
					<h3 class="text-xl font-semibold py-2">Dashboard</h3>
					<p class="text-sm text-center text-gray-700">
						Offer a holistic view of the customer support process, including graph and status.
					</p>
				</div>
			</div>
			<div class="flex flex-col justify-between items-center w-72 h-80 px-6 py-9 border border-gray-400 rounded-lg">
				<img class="h-36" src={ibx} alt="" />
				<div class="flex flex-col items-center">
					<h3 class="text-xl font-semibold py-2">Tickets</h3>
					<p class="text-sm text-center text-gray-700">
						For better issue-handling, customers' complaints will be resolved in forms of tickets.
					</p>
				</div>
			</div>
			<div class="flex flex-col justify-between items-center w-72 h-80 px-6 py-9 border border-gray-400 rounded-lg">
				<img class="h-36" src={ibx} alt="" />
				<div class="flex flex-col items-center">
					<h3 class="text-xl font-semibold py-2">Manage Organization</h3>
					<p class="text-sm text-center text-gray-700">
						Allow setting preferences such as permissions and assigning teams/members to be in the organization.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="flex flex-col py-10 items-center" id="landing-pricing">
	<h1 class="font-bold text-6xl pt-5 pb-5">Katalyst Desk Pricing</h1>
	<p class="text-slate-500">Affordable plans for any needs. Cancel anytime.</p>
	<div>
		<Tabs.Root value="account" class="w-[400px] flex justify-center items-center p-5">
			<Tabs.List>
				<Tabs.Trigger value="account">Monthly plans</Tabs.Trigger>
				<Tabs.Trigger value="password">Annual plans</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="account"></Tabs.Content>
		</Tabs.Root>
	</div>
	<div class="flex flex-row justify-between gap-6">
		<Card.Root class="h-60 w-80 flex justify-center items-center">
			<Card.Header class="justify-center">
				<p class="text-base">Basic</p>
				<Card.Title class="text-4xl">Rp 70,000 <span class="text-base">per month</span></Card.Title>
				<Card.Description class="p-1"></Card.Description>
				<Button>Select</Button>
			</Card.Header>
		</Card.Root>
		<Card.Root class="h-60 w-80 flex justify-center items-center">
			<Card.Header class="justify-center">
				<p class="text-sm">Standard</p>
				<Card.Title class="text-4xl">Rp 110,000 <span class="text-sm">per month</span></Card.Title>
				<Card.Description class="p-1"></Card.Description>
				<Button>Select</Button>
			</Card.Header>
		</Card.Root>
		<Card.Root class="h-60 w-80 flex justify-center items-center">
			<Card.Header class="justify-center">
				<p class="text-sm">Premium</p>
				<Card.Title class="text-4xl">Rp 150,000 <span class="text-sm">per month</span></Card.Title>
				<Card.Description class="p-3"></Card.Description>
				<Button>Select</Button>
			</Card.Header>
		</Card.Root>
	</div>

	<div class="w-11/12">
		<table
			class="w-full rounded-xl my-8 table-fixed border border-gray-300 overflow-hidden border-separate shadow-xl"
		>
			<thead>
				<tr class="[&>th]:font-semibold">
					<th class="w-96 text-left p-8">
						<p class="py-2 text-xl">Compare plans</p>
						<p class="text-gray-400 text-sm">
							Choose your workspace plan according to your organizational plan
						</p>
					</th>
					{#each plans as plan}
						<th class="text-4xl text-center">{plan.name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each plans[0].features as { label }, index}
					<tr class="border-t">
						<td class="w-96 p-8 border-t border-gray-300">{label}</td>
						{#each plans as plan}
							<td class="text-center border-t border-gray-300">
								{#if typeof plan.features[index].value === 'boolean'}
									{#if plan.features[index].value}
										<BadgeCheck class="text-orange-600 mx-auto" />
									{/if}
								{:else}
									{plan.features[index].value}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div class="flex flex-col w-full items-center justify-center">
		<p class="text-4xl font-semibold pb-4">FAQs</p>
		<Accordion.Root class="w-full sm:max-w-[70%] pb-8">
			<Accordion.Item value="item-1">
				<Accordion.Trigger class="text-xl">Can i use Katalyst Desk feature without for free?</Accordion.Trigger>
				<Accordion.Content class="text-lg">
					Yes, you can. To have the full access to our features, you can also choose the paid plan according to your needs.</Accordion.Content
				>
			</Accordion.Item>
			<Accordion.Item value="item-2">
				<Accordion.Trigger class="text-xl">How to change my plan from one to another?</Accordion.Trigger>
				<Accordion.Content class="text-lg">
					Choose your next plan for your business and the previous plan will automatically canceled and changed.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-3">
				<Accordion.Trigger class="text-xl">Can i cancel my subscription?</Accordion.Trigger>
				<Accordion.Content class="text-lg">
					Yes, you can cancel your subscription at any time. There is an option for cancellation on the setting page.
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
</div>

<div class="flex flex-col py-10 items-center">
	<p class="font-bold text-6xl pt-5 pb-5">Contact Us</p>
	<Card.Root>
		<Card.Header>
			<Card.Title>Report an issue</Card.Title>
			<Card.Description>What area are you having problems with?</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-6">
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label for="area">Area</Label>
					<Select.Root>
						<Select.Trigger id="area">
							<Select.Value placeholder="Select" />
						</Select.Trigger>
						<Select.Content>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="grid gap-2">
					<Select.Root>
						<Select.Trigger
							id="security-level"
							class="line-clamp-1 flex w-[160px] truncate"
						>
							<Select.Value placeholder="Select level" />
						</Select.Trigger>
						<Select.Content>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="grid gap-2">
				<Label for="subject">Subject</Label>
				<Input id="subject" placeholder="I need help with..." />
			</div>
			<div class="grid gap-2">
				<Label for="description">Description</Label>
				<Textarea
					id="description"
					placeholder="Please include all information relevant to your issue."
				/>
			</div>
		</Card.Content>
		<Card.Footer class="justify-between space-x-2">
			<Button variant="ghost">Cancel</Button>
			<Button>Submit</Button>
		</Card.Footer>
	</Card.Root>
</div>

<footer class="flex w-full h-20 bg-gray-100 justify-center items-center shadow-lg">
	© 2024, PT Global Integritas Teknologi
</footer>
