import type { OrganizationInfo, OrganizationObject } from '$types/organization-type';
import { writable, type Writable } from 'svelte/store';

export const availableOrganizations: Writable<OrganizationObject[] | null> = writable(null);
export const selectedOrganization: Writable<OrganizationInfo | null> = writable(null);