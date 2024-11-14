import { z } from 'zod';

export const createTeamSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(64, 'Name must not exceed 64 characters')
});
