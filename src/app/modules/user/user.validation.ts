import { z } from 'zod';

const createUserZodSchema = z.object({
  email: z.string({ required_error: 'Email name is required' }),
  password: z.string({ required_error: 'Password is required' }),
});

const updateZodSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
});

const updateLocationZodSchema = z.object({
  longitude: z.string({ required_error: 'Longitude is required' }),
  latitude: z.string({ required_error: 'Latitude is required' }),
});

export const UserValidation = {
  createUserZodSchema,
  updateZodSchema,
  updateLocationZodSchema,
};
