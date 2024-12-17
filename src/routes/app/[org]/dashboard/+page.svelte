<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { formatDistanceStrict, setMonth, subMonths } from 'date-fns';
	import { LineChart, PieChart } from 'layerchart';

	import * as Card from '$ui/card';
	import * as Select from '$ui/select';
	import HighlightCard from './highlight-card.svelte';

	import { OrganizationAPI } from '$api/index';
	import type { OrganizationDashboard } from '$types/organization-type';
	import { LoadingPage } from '$module/page';
	import { agentHasPermission } from '$utils/index';
	import { TEAM_MANAGE, TICKET_DETAIL } from '$lib/permissions';

	const availableMonths = [
		{
			value: '1',
			label: 'January'
		},
		{
			value: '2',
			label: 'February'
		},
		{
			value: '3',
			label: 'March'
		},
		{
			value: '4',
			label: 'April'
		},
		{
			value: '5',
			label: 'May'
		},
		{
			value: '6',
			label: 'June'
		},
		{
			value: '7',
			label: 'July'
		},
		{
			value: '8',
			label: 'August'
		},
		{
			value: '9',
			label: 'September'
		},
		{
			value: '10',
			label: 'October'
		},
		{
			value: '11',
			label: 'November'
		},
		{
			value: '12',
			label: 'December'
		}
	];

	let dashboard: OrganizationDashboard | null = $state(null);
	let monthValue: string = $state('');
	let yearValue: string = $state('');
	let orgId = $derived($page.params.org);
	let months = $derived(availableMonths.slice(0, new Date(Date.now()).getMonth() + 1));
	let years = $derived.by(() => {
		const now = new Date(Date.now());
		const year = now.getFullYear();

		const allYears = [];

		for (let i = year; i >= 2010; i--) {
			allYears.push({
				label: String(i),
				value: String(i)
			});
		}

		return allYears;
	});
	let monthsContent = $derived(
		months.find((m) => m.value === monthValue)?.label ?? 'Select a month'
	);

	$effect(() => {
		if (monthValue == '' || yearValue == '') return;

		fetchOrganizationDashboard(Number(monthValue), Number(yearValue));
	});

	const formatDuration = (seconds: number) => {
		const now = new Date(Date.now());
		const after = new Date(now.getTime() + seconds * 1000);
		return formatDistanceStrict(now, after);
	};

	const fetchOrganizationDashboard = async (month: number, year: number) => {
		const { data, ok } = await OrganizationAPI.getDashboardDetails(orgId, month, year);

		if (!ok) return;

		dashboard = data;
		dashboard.ticket_overview = dashboard.ticket_overview.map((t) => ({
			Instagram: t.Instagram,
			WhatsApp: t.WhatsApp,
			date: new Date(t.date)
		}));

		let recentDate = dashboard.ticket_overview[0]?.date || new Date(Date.now());
		for (let i = 1; i <= 5; i++) {
			dashboard.ticket_overview.unshift({
				date: subMonths(recentDate, i),
				WhatsApp: 0,
				Instagram: 0
			});
		}
	};

	const setMonthAndYear = () => {
		const now = new Date(Date.now());
		const month = now.getMonth();
		const year = now.getFullYear();

		monthValue = String(month + 1);
		yearValue = String(year);
	};

	onMount(() => {
		setMonthAndYear();
		agentHasPermission(TICKET_DETAIL);
		agentHasPermission(TEAM_MANAGE);
	});
</script>

<div class="w-full h-full p-4 space-y-4">
	{#if !dashboard}
		<LoadingPage />
	{:else}
		<div
			class="w-full py-4 px-4 flex justify-between items-center border-border bg-secondary rounded-xl"
		>
			<h3>Performance Analytics</h3>
			<div class="flex space-x-2">
				<Select.Root type="single" name="month" bind:value={monthValue}>
					<Select.Trigger class="w-[140px]">
						{monthsContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.GroupHeading>Months</Select.GroupHeading>
							{#each months as month}
								<Select.Item value={month.value} label={month.label}>{month.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				<Select.Root type="single" name="year" bind:value={yearValue}>
					<Select.Trigger class="w-[100px]">
						{yearValue}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.GroupHeading>Year</Select.GroupHeading>
							{#each years as year}
								<Select.Item value={year.value} label={year.label}>{year.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<div class="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<HighlightCard label="Total Tickets" value={dashboard.ticket_count} />
			<HighlightCard label="Total Messages" value={dashboard.message_count} />
			<HighlightCard
				label="Ticket Resolution Time"
				value={formatDuration(dashboard.ticket_resolution_time)}
			/>
			<HighlightCard
				label="Message Response Time"
				value={formatDuration(dashboard.message_response_time)}
			/>
		</div>
		<div class="w-full h-96 grid grid-cols-[1fr_2fr] gap-4">
			<Card.Root class="bg-secondary">
				<Card.Header>
					<Card.Title class="text-base font-medium">Ticket Statuses</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="h-[300px]">
						<PieChart
							data={dashboard.ticket_status}
							key="status"
							value="count"
							label={(d: any) => {
								switch (d.status) {
									case 'open':
										return 'Open';
									case 'close':
										return 'Close';
								}
							}}
							cRange={['hsl(348 100% 50%)', 'hsl(140 100% 50%)']}
							legend
						/>
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root class="bg-secondary">
				<Card.Header>
					<Card.Title class="text-base font-medium">Ticket Overview</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="h-[300px] fill-foreground">
						<LineChart
							data={dashboard.ticket_overview}
							x="date"
							series={[
								{ key: 'WhatsApp', color: 'hsl(142, 70%, 49%)' },
								{ key: 'Instagram', color: 'hsl(335, 100%, 50%)' }
							]}
						/>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
