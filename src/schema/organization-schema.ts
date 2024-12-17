import { z } from 'zod';

export const createOrganizationSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(64, 'Name must not exceed 64 characters')
});

export const modifyOrganizationSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(64, 'Name must not exceed 64 characters')
});

export const updateWelcomeMessageSchema = z.object({
	message: z
		.string()
		.min(2, 'Welcome message must be at least 2 characters')
		.max(320, 'Welcome message must not exceed 320 characters')
});
