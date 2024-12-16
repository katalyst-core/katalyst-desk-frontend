import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { selectedOrganization } from '$stores/organization-store';
import { get } from 'svelte/store';

export const redirect = async (origins: RegExp[], target: string) => {
	const $page = get(page);
	const path = $page.url.pathname;
	if (!path) {
		return;
	}

	for (const origin of origins) {
		const valid = origin.test(path);

		if (valid) {
			return await goto(target, {
				invalidateAll: true
			});
		}
	}
};

export const orgTarget = (target: string) => {
	const { org: orgId } = get(page).params;

	if (!orgId) {
		return;
	}

	return `/app/${orgId}${target}`;
};

export const getTextInitials = (name: string) => {
	if (!name) {
		return '';
	}

	return name
		.split(' ')
		.slice(0, 2)
		.map((name) => name[0].toUpperCase())
		.join('');
};

export const textToColor = (text: string) => {
	if (!text) {
		text = '';
	}

	const chars = text.split('');
	let count = 0;
	chars.forEach((char) => (count += char.charCodeAt(0)));

	const colors = [
		'bg-red-600',
		'bg-orange-600',
		'bg-yellow-600',
		'bg-green-600',
		'bg-blue-600',
		'bg-pink-600',
		'bg-purple-600'
	];

	return colors[count % colors.length];
};

export const scrollToBottom = (element: HTMLElement) => {
	element.scroll({ top: element.scrollHeight, behavior: 'auto' });
};

export const agentHasPermission = (permission: bigint) => {
	const org = get(selectedOrganization);

	if (!org) return false;

	if (org.permission == '-1') return true;

	const permissions = BigInt(org.permission);

	return !!(permissions & permission);
};
