import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name must at least be 1 character').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Email must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must not exceed 128 characters'),
});

export const createStoreSchema = z.object({
  name: z.string().min(4, 'Name must at least be 4 characters').max(100, 'Name must not exceed 100 characters'),
});

export const wholesaleSchema = z.object({
  min_quantity: z.coerce.number().min(1),
  price: z.coerce.number()
})

export const createProductSchema = z.object({
  name: z.string().min(25, 'Name must be at least 25 character'),
  description: z.string(),
  sku: z.string(),
  condition: z.string().min(1, 'Needs to be filled').default('new'),
  price: z.coerce.number({ message: 'Invalid' }).min(1, 'Must be bigger than 1'),
  discount_price: z.coerce.number({ message: 'Invalid' }).min(1, 'Must be bigger than 1'),
  discount_percentage: z.coerce.number({ message: 'Invalid' }).min(1, 'Must be bigger than 1'),
  wholesale: z.array(wholesaleSchema),
  brand: z.string(),
  stock: z.number().min(0).default(0),
  dimension_width: z.coerce.number({ message: 'Invalid' }).min(1, 'Must be bigger than 1'),
  dimension_height: z.coerce.number({ message: 'Invalid' }).min(1, 'Must be bigger than 1'),
  dimension_length: z.coerce.number({ message: 'Invalid' }).min(1, 'Must be bigger than 1'),
  weight: z.coerce.number({ message: 'Invalid' }).min(1, 'Must be bigger than 1'),
});