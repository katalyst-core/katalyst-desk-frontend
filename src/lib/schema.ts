import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name must at least be 1 character').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Email must be a valid email'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(32, 'Username must not exceed 32 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must not exceed 128 characters'),
});

export const createStoreSchema = z.object({
  name: z.string().min(4, 'Name must at least be 4 characters').max(100, 'Name must not exceed 100 characters'),
});