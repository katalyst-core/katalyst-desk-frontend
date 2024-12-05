import { z } from 'zod';

export const signInSchema = z.object({
	email: z.string().min(1, 'Email is required'),
	password: z.string().min(1, 'Password is required')
});

export const signUpSchema = z.object({
	name: z
		.string()
		.min(1, 'Name must at least be 1 character')
		.max(100, 'Name must not exceed 100 characters'),
	email: z.string().email('Email must be a valid email'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(128, 'Password must not exceed 128 characters')
});

export const addAgentToOrganization = z.object({
	email: z.string().email('Must be a valid email')
});

export const forgetPasswordSchema = z.object({
	email: z.string().email('Must be a valid email')
});

export const resetPasswordSchema = z.object({
	newPassword: z.string().min(1, 'Password is required')
});
