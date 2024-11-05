import type { OrganizationObject } from '$types/organization-type';
import { writable, type Writable } from 'svelte/store';

export const availableOrganizations: Writable<OrganizationObject[] | null> = writable(null);