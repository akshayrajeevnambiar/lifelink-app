import { z } from 'zod';
import { normalizeLocation, normalizePhone } from './utils';

export const bloodGroups = [
  'O_POSITIVE', 'O_NEGATIVE',
  'A_POSITIVE', 'A_NEGATIVE',
  'B_POSITIVE', 'B_NEGATIVE',
  'AB_POSITIVE', 'AB_NEGATIVE',
] as const;

export const DonorCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bloodGroup: z.enum(bloodGroups),
  location: z.string().min(1).transform(normalizeLocation),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+\d\s\-()]+$/, 'Invalid phone format')
    .transform(normalizePhone),
});

export const DonorSearchSchema = z.object({
  name: z.string().optional(),
  bloodGroup: z.enum(bloodGroups).optional(),
  location: z.string().optional().transform((v) => (v ? normalizeLocation(v) : v)),
  phone: z.string().optional().transform((v) => (v ? normalizePhone(v) : v)),
});

// Usage examples:
// DonorCreateSchema.parse({ name: 'Alice', bloodGroup: 'O_POSITIVE', location: ' Toronto ', phone: '+1 (416) 555-1234' })
// DonorSearchSchema.parse({ name: 'Bob', bloodGroup: 'A_NEGATIVE', location: 'North York', phone: '416-555-2345' })
