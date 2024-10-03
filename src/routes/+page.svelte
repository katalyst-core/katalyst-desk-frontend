<script lang="ts">
	import { BadgeCheck, CircleCheckBig, Menu } from 'lucide-svelte';
	import { Button } from '$ui/button';
	import * as Card from '$ui/card';
	import * as Tabs from '$ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';

	import KatalystLogo from '$lib/images/katalyst-logo.png';
	import InboxGraphic from '$lib/images/graphics/inbox.png';
	import MultiChannelGraphic from '$lib/images/graphics/multi-channel.png';
	import TrackProgressGraphic from '$lib/images/graphics/track-progress.png';
	import WebPreviewGraphic from '$lib/images/graphics/web-preview.png';
	import StatisticGraphic from '$lib/images/graphics/statistic-graph.png';

	$: isAnnualPayment = true;
	let isOpen = false;

	const scrollIntoView = ({ target }: { target: any }) => {
		const el = document.querySelector(target.getAttribute('href'));
		if (!el) return;

		setTimeout(() => {
			el.scrollIntoView({
				block: 'start',
				behavior: 'smooth'
			});
		}, 10);
	};

	const Rupiah = Intl.NumberFormat('en-ID', {
		style: 'currency',
		currency: 'IDR'
	});

	const pricing = [
		{
			label: 'Basic Plan',
			monthly: 'Rp. 90,000',
			yearly: 'Rp. 75,000',
			features: [
				'3 Multichannel Support',
				'100 Tickets / Month',
				'Report & Analysis',
				'Team Management'
			]
		},
		{
			label: 'Premium Plan',
			monthly: 'Rp. 180,000',
			yearly: 'Rp. 150,000',
			features: [
				'5 Multichannel Support',
				'1,000 Tickets / Month',
				'Automation',
				'Chatbot Integration',
				'Report & Analysis',
				'Team Management',
				'Standard Customer Support'
			]
		},
		{
			label: 'Enterprise Plan',
			monthly: 'Contact Us',
			yearly: 'Contact Us',
			features: [
				'Unlimited Multichannel',
				'Unlimited Tickets',
				'Automation',
				'Chatbot Integration',
				'Report & Analysis',
				'Team Management',
				'Standard Customer Support'
			]
		}
	];

	const plans = {
		labels: ['Basic', 'Premium', 'Enterprise'],
		features: [
			{
				label: 'Multichannel Support',
				values: ['3 channels', '5 channels', 'Unlimited']
			},
			{
				label: 'Ticket Management',
				values: ['100 tickets per month', '1,000 tickets per month', 'Unlimited tickets']
			},
			{
				label: 'Reporting & Analytics',
				values: [true, true, true]
			},
			{
				label: 'Team Management',
				values: [true, true, true]
			},
			{
				label: 'Automation',
				values: [false, true, true]
			},
			{
				label: 'Chatbot Integrations',
				values: [false, true, true]
			},
			{
				label: 'Support',
				values: [false, true, true]
			}
		]
	};

	const features = [
		{
			label: 'Unified Inbox',
			icon: InboxGraphic,
			desc: 'Consolidate messages from various platforms (WhatsApp, LINE, email, etc.) into one view.'
		},
		{
			label: 'Multichannel Support',
			icon: MultiChannelGraphic,
			desc: 'Support for multiple platforms (WhatsApp, LINE, email, web chat, etc.) to provide flexibility for customers.'
		},
		{
			label: 'Ticket Management',
			icon: TrackProgressGraphic,
			desc: 'Assign, prioritize, and track the progress of customer issues across different support channels.'
		},
		{
			label: 'Performance Analytics',
			icon: StatisticGraphic,
			desc: 'Provide data on response times, ticket resolution, customer satisfaction, and agent performance.'
		}
	];

	const toggleMenu = () => (isOpen = !isOpen);
	const closeMenu = () => (isOpen = false);
</script>

<header
	class="sticky top-0 z-50 flex items-center p-6 h-24 justify-between text-lg bg-white border-b-2 shadow"
>
	<a href="/" class="flex items-center gap-2">
		<img class="h-16" src={KatalystLogo} alt="Katalyst Desk Logo" />
		<h1 class="font-medium text-3xl">Katalyst Desk</h1>
	</a>

	<!-- Burger Menu Button -->
	<button class="md:hidden flex items-center px-2 text-gray-800" on:click={toggleMenu}>
		<Menu class="w-10 h-10" />
	</button>

	<!-- Menu Items -->
	<nav class="hidden md:flex space-x-8 items-center justify-end">
		<a href="#landing-features" on:click|preventDefault={scrollIntoView} class="hidden sm:block"
			>Features</a
		>
		<a href="#landing-pricing" on:click|preventDefault={scrollIntoView} class="hidden sm:block"
			>Pricing</a
		>
		<a href="#landing-contact" on:click|preventDefault={scrollIntoView} class="hidden sm:block"
			>Contact Us</a
		>
		<div class="space-x-2">
			<Button variant="outline" href="#" class="text-lg px-7 py-6">Coming Soon</Button>
		</div>
	</nav>

	<!-- Mobile Menu -->
	<div
		class={`${
			isOpen ? 'max-h-[15em]' : 'max-h-0'
		} block overflow-hidden md:hidden absolute top-24 right-0 w-full bg-white shadow-lg transition-all duration-100 ease-linear`}
	>
		<ul class="flex flex-col items-start space-y-4 py-4 w-full px-4 [&>li]:py-2 [&>li]:px-2">
			<li>
				<a href="#landing-features" on:click={closeMenu} class="text-lg">Features</a>
			</li>
			<li>
				<a href="#landing-pricing" on:click={closeMenu} class="text-lg">Pricing</a>
			</li>
			<li>
				<a href="#landing-contact" on:click={closeMenu} class="text-lg">Contact Us</a>
			</li>
			<li class="w-full">
				<Button
					variant="outline"
					href="#"
					class="text-lg px-7 py-6 w-full border-2 border-gray-400 border-opacity-30"
					>Coming Soon</Button
				>
			</li>
		</ul>
	</div>
</header>

<div class="flex flex-col items-center relative">
	<div class="flex flex-col items-center px-4 py-12 sm:py-24">
		<div>
			<h1
				class="font-bold leading-[1em] text-slate-800 text-center sm:py-4"
				style="font-size: clamp(32px,7vw,100px);"
			>
				<span class="bg-gradient-to-r bg-clip-text text-transparent from-blue-500 to-blue-600">
					Reach
				</span>
				you better <br /> Get responses
				<span class="bg-gradient-to-r bg-clip-text text-transparent from-orange-600 to-orange-500">
					faster
				</span>
			</h1>
			<p
				class="font-semibold text-slate-500 text-xl sm:text-2xl py-2 text-center"
				style="font-size: clamp(16px,2.5vw,100px);"
			>
				Transform the way you connect with your customer.
			</p>
		</div>
		<div class="flex flex-col sm:flex-row justify-center items-center sm:space-x-8">
			<Button size="lg" class="text-xl my-6 font-semibold">Try for free</Button>
			<a href="/demo" class="text-xl font-semibold">Get a demo ></a>
		</div>
	</div>

	<div class="px-8 sm:max-w-[75%] z-10">
		<img
			src={WebPreviewGraphic}
			alt=""
			class="bg-white pb-20 border-2 border-gray-400 border-opacity-30 rounded-2xl"
		/>
	</div>

	<svg
		id="wave"
		style="transform:rotate(0deg); transition: 0.3s"
		viewBox="0 0 1440 380"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		class="absolute bottom-8 z-0"
		><defs
			><linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0"
				><stop stop-color="rgba(255, 175.574, 0, 1)" offset="0%"></stop><stop
					stop-color="rgba(255, 175.574, 0, 1)"
					offset="100%"
				></stop></linearGradient
			></defs
		><path
			style="transform:translate(0, 0px); opacity:1"
			fill="url(#sw-gradient-0)"
			d="M0,76L60,107.7C120,139,240,203,360,221.7C480,241,600,215,720,228C840,241,960,291,1080,291.3C1200,291,1320,241,1440,183.7C1560,127,1680,63,1800,38C1920,13,2040,25,2160,50.7C2280,76,2400,114,2520,145.7C2640,177,2760,203,2880,183.7C3000,165,3120,101,3240,114C3360,127,3480,215,3600,209C3720,203,3840,101,3960,101.3C4080,101,4200,203,4320,253.3C4440,304,4560,304,4680,291.3C4800,279,4920,253,5040,259.7C5160,266,5280,304,5400,291.3C5520,279,5640,215,5760,158.3C5880,101,6000,51,6120,44.3C6240,38,6360,76,6480,82.3C6600,89,6720,63,6840,69.7C6960,76,7080,114,7200,152C7320,190,7440,228,7560,215.3C7680,203,7800,139,7920,126.7C8040,114,8160,152,8280,196.3C8400,241,8520,291,8580,316.7L8640,342L8640,380L8580,380C8520,380,8400,380,8280,380C8160,380,8040,380,7920,380C7800,380,7680,380,7560,380C7440,380,7320,380,7200,380C7080,380,6960,380,6840,380C6720,380,6600,380,6480,380C6360,380,6240,380,6120,380C6000,380,5880,380,5760,380C5640,380,5520,380,5400,380C5280,380,5160,380,5040,380C4920,380,4800,380,4680,380C4560,380,4440,380,4320,380C4200,380,4080,380,3960,380C3840,380,3720,380,3600,380C3480,380,3360,380,3240,380C3120,380,3000,380,2880,380C2760,380,2640,380,2520,380C2400,380,2280,380,2160,380C2040,380,1920,380,1800,380C1680,380,1560,380,1440,380C1320,380,1200,380,1080,380C960,380,840,380,720,380C600,380,480,380,360,380C240,380,120,380,60,380L0,380Z"
		></path><defs
			><linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0"
				><stop stop-color="rgba(243, 106, 62, 1)" offset="0%"></stop><stop
					stop-color="rgba(255, 179, 11, 1)"
					offset="100%"
				></stop></linearGradient
			></defs
		><path
			style="transform:translate(0, 50px); opacity:0.9"
			fill="url(#sw-gradient-1)"
			d="M0,152L60,164.7C120,177,240,203,360,177.3C480,152,600,76,720,44.3C840,13,960,25,1080,76C1200,127,1320,215,1440,221.7C1560,228,1680,152,1800,152C1920,152,2040,228,2160,228C2280,228,2400,152,2520,120.3C2640,89,2760,101,2880,133C3000,165,3120,215,3240,234.3C3360,253,3480,241,3600,215.3C3720,190,3840,152,3960,139.3C4080,127,4200,139,4320,120.3C4440,101,4560,51,4680,25.3C4800,0,4920,0,5040,38C5160,76,5280,152,5400,190C5520,228,5640,228,5760,202.7C5880,177,6000,127,6120,114C6240,101,6360,127,6480,126.7C6600,127,6720,101,6840,82.3C6960,63,7080,51,7200,95C7320,139,7440,241,7560,278.7C7680,317,7800,291,7920,240.7C8040,190,8160,114,8280,88.7C8400,63,8520,89,8580,101.3L8640,114L8640,380L8580,380C8520,380,8400,380,8280,380C8160,380,8040,380,7920,380C7800,380,7680,380,7560,380C7440,380,7320,380,7200,380C7080,380,6960,380,6840,380C6720,380,6600,380,6480,380C6360,380,6240,380,6120,380C6000,380,5880,380,5760,380C5640,380,5520,380,5400,380C5280,380,5160,380,5040,380C4920,380,4800,380,4680,380C4560,380,4440,380,4320,380C4200,380,4080,380,3960,380C3840,380,3720,380,3600,380C3480,380,3360,380,3240,380C3120,380,3000,380,2880,380C2760,380,2640,380,2520,380C2400,380,2280,380,2160,380C2040,380,1920,380,1800,380C1680,380,1560,380,1440,380C1320,380,1200,380,1080,380C960,380,840,380,720,380C600,380,480,380,360,380C240,380,120,380,60,380L0,380Z"
		></path></svg
	>

	<svg
		id="wave"
		style="transform:rotate(0deg); transition: 0.3s"
		viewBox="0 0 1440 280"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		class="absolute bottom-0 z-20"
		><defs
			><linearGradient id="sw-gradient-2" x1="0" x2="0" y1="1" y2="0"
				><stop stop-color="rgba(255, 255, 255, 1)" offset="0%"></stop><stop
					stop-color="rgba(255, 255, 255, 1)"
					offset="100%"
				></stop></linearGradient
			></defs
		><path
			style="transform:translate(0, 0px); opacity:1"
			fill="url(#sw-gradient-2)"
			d="M0,56L40,79.3C80,103,160,149,240,154C320,159,400,121,480,126C560,131,640,177,720,177.3C800,177,880,131,960,121.3C1040,112,1120,140,1200,140C1280,140,1360,112,1440,112C1520,112,1600,140,1680,149.3C1760,159,1840,149,1920,154C2000,159,2080,177,2160,177.3C2240,177,2320,159,2400,154C2480,149,2560,159,2640,158.7C2720,159,2800,149,2880,140C2960,131,3040,121,3120,121.3C3200,121,3280,131,3360,140C3440,149,3520,159,3600,149.3C3680,140,3760,112,3840,102.7C3920,93,4000,103,4080,93.3C4160,84,4240,56,4320,60.7C4400,65,4480,103,4560,107.3C4640,112,4720,84,4800,84C4880,84,4960,112,5040,102.7C5120,93,5200,47,5280,32.7C5360,19,5440,37,5520,56C5600,75,5680,93,5720,102.7L5760,112L5760,280L5720,280C5680,280,5600,280,5520,280C5440,280,5360,280,5280,280C5200,280,5120,280,5040,280C4960,280,4880,280,4800,280C4720,280,4640,280,4560,280C4480,280,4400,280,4320,280C4240,280,4160,280,4080,280C4000,280,3920,280,3840,280C3760,280,3680,280,3600,280C3520,280,3440,280,3360,280C3280,280,3200,280,3120,280C3040,280,2960,280,2880,280C2800,280,2720,280,2640,280C2560,280,2480,280,2400,280C2320,280,2240,280,2160,280C2080,280,2000,280,1920,280C1840,280,1760,280,1680,280C1600,280,1520,280,1440,280C1360,280,1280,280,1200,280C1120,280,1040,280,960,280C880,280,800,280,720,280C640,280,560,280,480,280C400,280,320,280,240,280C160,280,80,280,40,280L0,280Z"
		></path></svg
	>
</div>

<div id="landing-features" class="flex flex-col justify-center items-center px-8 py-32 relative">
	<h1
		class="text-2xl font-medium pb-5 bg-gradient-to-r from-blue-700 to-indigo-400 inline-block text-transparent bg-clip-text text-center"
	>
		What is Katalyst-Desk?
	</h1>
	<h2 class="text-2xl sm:text-5xl font-bold pb-4 justify-center items-center text-center">
		Reach Customers Everywhere. <br /> Respond to Their Needs Anywhere.
	</h2>
	<p class="text-base sm:text-xl pb-4 justify-center items-center text-center">
		Katalyst Desk help Streamline your customer support with our omnichannel solution, <br /> enabling
		you to deliver personalized, timely, and cohesive experiences that exceed expectations.
	</p>

	<div class="py-12">
		<div class="flex flex-col sm:grid grid-cols-1 justify-center md:grid-cols-2 gap-x-12 gap-y-4">
			{#each features as feature, i}
				<div
					class="flex flex-col justify-between items-center w-72 h-80 px-6 py-9 border-2 border-gray-400 border-opacity-40 rounded-lg shadow-lg {i %
						2 !==
					0
						? 'md:mt-10'
						: ''}"
				>
					<img class="h-36" src={feature.icon} alt="" />
					<div class="flex flex-col items-center">
						<h3 class="text-xl font-semibold py-2">{feature.label}</h3>
						<p class="text-sm text-center text-gray-700">{feature.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<div id="landing-pricing" class="flex flex-col py-32 items-center">
	<h1 class="font-bold text-[3.2em] pt-5 pb-5 text-center">Katalyst Desk Pricing</h1>
	<p class="text-slate-500 px-2 text-center">Affordable plans for any needs. Cancel anytime.</p>
	<div>
		<Tabs.Root
			value="yearly"
			onValueChange={(value) => (isAnnualPayment = value === 'yearly')}
			class="flex justify-center items-center p-4"
		>
			<Tabs.List>
				<Tabs.Trigger value="monthly" class="text-sm sm:text-lg px-4">Monthly plans</Tabs.Trigger>
				<Tabs.Trigger value="yearly" class="text-sm sm:text-lg px-4">Annual plans</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="account"></Tabs.Content>
		</Tabs.Root>
	</div>

	<div class="flex flex-col lg:flex-row w-full px-4 justify-center gap-6">
		{#each pricing as price}
			<Card.Root class="w-full lg:w-[22rem] flex flex-col">
				<Card.Header>
					<p class="text-base">{price.label}</p>
					<Card.Title class="flex items-center">
						<p class="text-4xl">
							{isAnnualPayment ? price.yearly : price.monthly}
						</p>
						<div class="flex flex-col justify-center h-full pl-2">
							{#if price.monthly !== 'Contact Us'}
								<p class="text-xs">/ month</p>
								<p class="text-xs">
									billed
									{#if isAnnualPayment}
										annually
									{:else}
										monthly
									{/if}
								</p>
							{/if}
						</div>
					</Card.Title>
					<div class="w-full">
						<Button size="lg" class="w-full text-xl my-4 font-semibold">Contact us</Button>
					</div>
				</Card.Header>
				<Card.Content class="flex flex-col gap-1">
					{#each price.features as feature}
						<p class="flex items-center font-medium">
							<CircleCheckBig class="inline mr-2 w-5 h-5 text-orange-600" />
							{feature}
						</p>
					{/each}
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<div class="hidden md:flex justify-center w-full px-8 max-w-[100em]">
		<table
			class="w-full rounded-xl my-8 table-fixed border border-gray-300 overflow-hidden border-separate shadow-xl"
		>
			<thead>
				<tr class="[&>th]:font-semibold">
					<th class="w-80 text-left p-8">
						<p class="py-2 text-xl">Compare plans</p>
						<p class="text-gray-400 text-sm">
							Choose your plan according to your organizational needs
						</p>
					</th>
					{#each plans.labels as label}
						<th class="text-4xl text-center" style="font-size: clamp(6px,2vw,100px);">{label}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each plans.features as { label, values }}
					<tr class="border-t">
						<td class="p-8 border-t border-gray-300">{label}</td>
						{#each values as value}
							<td class="text-center border-t border-gray-300">
								{#if typeof value === 'boolean'}
									{#if value}
										<BadgeCheck class="text-orange-600 mx-auto" />
									{:else}
										<BadgeCheck class="text-gray-500 mx-auto" />
									{/if}
								{:else}
									{value}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div class="flex w-full justify-center">
	<div class="flex flex-col w-full max-w-[100em] px-8">
		<p class="text-4xl font-semibold pb-4">FAQs</p>
		<Accordion.Root class="w-full pb-8">
			<Accordion.Item value="item-1">
				<Accordion.Trigger class="text-xl text-left">
					What is an omnichannel customer support?
				</Accordion.Trigger>
				<Accordion.Content class="text-lg text-left">
					An omnichannel customer support platform allows businesses to manage customer interaction
					from multiple channels (e.g., WhatsApp, Facebook, Email, etc.) in one place.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-2">
				<Accordion.Trigger class="text-xl text-left">
					What channels can I connect to in the platform?
				</Accordion.Trigger>
				<Accordion.Content class="text-lg text-left">
					Currently, we only support WhatsApp and LINE messaging.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-3">
				<Accordion.Trigger class="text-xl text-left">
					How does the ticket management system work?
				</Accordion.Trigger>
				<Accordion.Content class="text-lg text-left">
					Our ticket management system organizes customer inquiries into tickets. Teams and
					individual agents can track, prioritize, and resolve these tickets efficiently.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-4">
				<Accordion.Trigger class="text-xl text-left">
					Can I use this platform if I'm a small business?
				</Accordion.Trigger>
				<Accordion.Content class="text-lg text-left">
					Yes! Our Basic Plan is designed specifically for small businesses. You can start with
					essential features and scale up as your business grows.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-5">
				<Accordion.Trigger class="text-xl text-left">
					Is there chatbot integration?
				</Accordion.Trigger>
				<Accordion.Content class="text-lg text-left">
					Yes, we offer chatbot integration. Depending on your plan, you can have a basic chatbot or
					an AI-powered chatbot that automate responses and engage customers 24/7.
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</div>

<div id="landing-contact" class="flex justify-center py-32 px-8">
	<div class=" flex flex-col items-center max-w-[75em]">
		<h2 class="text-2xl sm:text-5xl font-bold pb-4 justify-center items-center text-center">
			Contact Us
		</h2>
		<p class="text-base sm:text-xl pb-4 justify-center items-center text-center">
			We're excited to help you streamline your customer support across multiple channels! If you're
			interested in learning more or have any questions, feel free to get in touch. Simply click the
			button below, and our team will be happy to assist you with any inquiries.
		</p>
		<Button class="text-2xl px-8 py-8 my-10" href="mailto:katalystcore@gmail.com"
			>Contact Us Here</Button
		>
	</div>
</div>

<footer class="flex w-full h-20 bg-gray-200 justify-center items-center shadow-lg">
	© 2024, PT Global Integritas Teknologi
</footer>
