import { z } from 'zod';

export const strikeFiltersSchema = z.object({
  state: z.string().length(2).toUpperCase().optional(),
  city: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  status: z.enum(['active', 'ended', 'suspended', 'unconfirmed_end']).optional(),
  confidence: z.enum(['confirmed', 'likely', 'unverified']).optional(),
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Formato esperado: AAAA-MM')
    .optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  q: z.string().min(2).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(5000).default(20),
});

export const ingestSchema = z.object({
  rawText: z.string().min(50, 'Texto muito curto para extrair uma greve'),
  rawUrl: z.string().url().optional(),
  autoPublish: z.boolean().default(false),
});

export type StrikeFiltersInput = z.infer<typeof strikeFiltersSchema>;
export type IngestInput = z.infer<typeof ingestSchema>;