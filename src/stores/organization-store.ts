import type { OrganizationListObject } from '$types/organization-type';
import { writable, type Writable } from 'svelte/store';

export const availableOrganizations: Writable<OrganizationListObject[] | null> = writable(null);
export const selectedOrganization: Writable<string | null> = writable(null);