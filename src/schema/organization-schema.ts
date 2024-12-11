import { z } from 'zod';

export const createOrganizationSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(128, 'Name must not exceed 128 characters')
});

export const modifyOrganizationSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(128, 'Name must not exceed 128 characters')
});
