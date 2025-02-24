import { z } from "zod";

// Define schemas for Redis values
export const RedisValuesSchema = {
  links: z.array(z.string()).nullable().default(null),
  results: z.any().nullable().default(null),
  exploring: z.string().nullable().default(null),
  totalExploredLinks: z.coerce.number().nonnegative().default(0),
  totalDiscoveredLinks: z.coerce.number().nonnegative().default(0),
};

// Define the schema for the SSE data
export const ScrapeProgressSchema = z.object({
  exploring: z.string().nullable(),
  links: z.array(z.string()).nullable(),
  results: z.any().nullable(),
  totalExploredLinks: z.number().nonnegative(),
  totalDiscoveredLinks: z.number().nonnegative(),
  progress: z.number().min(0).max(100),
});

export type ScrapeProgress = z.infer<typeof ScrapeProgressSchema>;
